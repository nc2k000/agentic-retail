# Memory System - Developer Usage Guide

**Phase:** 0 - Foundation Complete
**Last Updated:** December 3, 2024

This guide explains how to use the customer memory system in your code.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Functions](#core-functions)
3. [Data Collection Patterns](#data-collection-patterns)
4. [AI Context Injection](#ai-context-injection)
5. [Helper Utilities](#helper-utilities)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)

---

## Quick Start

### Import Memory Functions

```typescript
import {
  upsertPreference,
  updatePattern,
  recordInteraction,
  fetchMemoryContext,
} from '@/lib/memory'
import type { MemoryContext } from '@/types/memory'
```

### Basic Usage Example

```typescript
// Record that user likes organic products
await upsertPreference({
  userId: user.id,
  type: 'brand',
  key: 'organic',
  confidence: 0.75,
  reason: 'User frequently selects organic items',
  source: 'pattern'
})

// Track a shopping pattern
await updatePattern({
  userId: user.id,
  type: 'time_of_day',
  key: 'evening',
  value: { timestamp: new Date().toISOString() }
})

// Record an interaction
await recordInteraction({
  userId: user.id,
  type: 'search',
  key: 'organic vegetables',
  value: { results_count: 12 }
})

// Fetch memory context for AI
const memoryContext = await fetchMemoryContext({
  userId: user.id,
  minConfidence: 0.70
})
```

---

## Core Functions

### 1. upsertPreference()

**Purpose:** Create or update a customer preference (dietary, brand, favorite, dislike, allergy)

**Signature:**
```typescript
async function upsertPreference(params: UpsertPreferenceParams): Promise<string | null>

interface UpsertPreferenceParams {
  userId: string
  type: PreferenceType // 'dietary' | 'brand' | 'favorite' | 'dislike' | 'allergy'
  key: string
  confidence?: number // 0.00 - 1.00, defaults to 0.50
  reason?: string
  source?: PreferenceSource // 'explicit' | 'inferred' | 'pattern', defaults to 'inferred'
}
```

**Behavior:**
- If preference doesn't exist → creates new row with given confidence
- If preference exists → updates to MAX(existing, new) confidence
- Increments `times_confirmed` counter
- Updates `last_confirmed_at` timestamp
- Returns preference ID or null on error

**Example - Explicit Dietary Preference:**
```typescript
// User says "I'm vegan"
await upsertPreference({
  userId: user.id,
  type: 'dietary',
  key: 'vegan',
  confidence: 1.0, // Explicit = 100% confidence
  reason: 'User explicitly stated dietary preference',
  source: 'explicit'
})
```

**Example - Inferred Brand Preference:**
```typescript
// User added 3 Great Value items
await upsertPreference({
  userId: user.id,
  type: 'brand',
  key: 'great value',
  confidence: 0.65,
  reason: 'Selected 3 times in shopping session',
  source: 'inferred'
})
```

**Example - Favorite from Pattern:**
```typescript
// User added milk 5 times over 3 weeks
await upsertPreference({
  userId: user.id,
  type: 'favorite',
  key: 'milk-whole-gal', // Use SKU for favorites
  confidence: 0.90,
  reason: 'Added to cart 5 times',
  source: 'pattern'
})
```

**Example - Critical Allergy:**
```typescript
// User says "I'm allergic to shellfish"
await upsertPreference({
  userId: user.id,
  type: 'allergy',
  key: 'shellfish',
  confidence: 1.0,
  reason: 'User reported allergy explicitly',
  source: 'explicit'
})
```

---

### 2. updatePattern()

**Purpose:** Track shopping patterns (time, frequency, basket size, categories)

**Signature:**
```typescript
async function updatePattern(params: UpdatePatternParams): Promise<string | null>

interface UpdatePatternParams {
  userId: string
  type: PatternType // 'time_of_day' | 'day_of_week' | 'frequency' | 'basket_size' | 'category_preference'
  key: string
  value?: Record<string, any> // Optional JSONB data
}
```

**Behavior:**
- If pattern doesn't exist → creates new with occurrence_count = 1
- If pattern exists → increments occurrence_count
- Updates `last_occurrence` timestamp
- Calculates confidence based on occurrence_count
- Returns pattern ID or null on error

**Example - Time of Day:**
```typescript
import { getCurrentTimePeriod } from '@/lib/memory'

// Track when user shops
await updatePattern({
  userId: user.id,
  type: 'time_of_day',
  key: getCurrentTimePeriod(), // 'morning' | 'afternoon' | 'evening' | 'night'
  value: {
    timestamp: new Date().toISOString(),
    order_id: orderId
  }
})
```

**Example - Day of Week:**
```typescript
import { getCurrentDayOfWeek } from '@/lib/memory'

// Track which days user shops
await updatePattern({
  userId: user.id,
  type: 'day_of_week',
  key: getCurrentDayOfWeek(), // 'monday', 'tuesday', etc.
  value: { order_count: 1 }
})
```

**Example - Basket Size:**
```typescript
import { getBasketSizeCategory } from '@/lib/memory'

// Track how much user buys
await updatePattern({
  userId: user.id,
  type: 'basket_size',
  key: getBasketSizeCategory(cart.length), // 'small' | 'medium' | 'large' | 'bulk'
  value: {
    item_count: cart.length,
    total: calculateTotal(cart)
  }
})
```

**Example - Category Preferences:**
```typescript
// Track which categories user buys from
cart.forEach(item => {
  if (item.category) {
    updatePattern({
      userId: user.id,
      type: 'category_preference',
      key: item.category, // 'Dairy', 'Produce', 'Bakery', etc.
      value: {
        quantity: item.quantity,
        price: item.price,
        sku: item.sku
      }
    }).catch(console.error) // Async, non-blocking
  }
})
```

---

### 3. recordInteraction()

**Purpose:** Log user interactions for pattern analysis

**Signature:**
```typescript
async function recordInteraction(params: RecordInteractionParams): Promise<string | null>

interface RecordInteractionParams {
  userId: string
  type: InteractionType // 'question' | 'search' | 'view_item' | 'swap' | 'reject_swap' | 'voice_used' | 'feature_used'
  key?: string
  value?: Record<string, any>
  sessionId?: string
}
```

**Behavior:**
- Creates new interaction record (never updates)
- Timestamps automatically added
- Used for analytics and pattern detection
- Returns interaction ID or null on error

**Example - User Question:**
```typescript
// User asks a question
if (message.includes('?')) {
  await recordInteraction({
    userId: user.id,
    type: 'question',
    key: 'query',
    value: {
      query: message.substring(0, 200), // Truncate for storage
      intent: 'recipe' // Optional: detected intent
    }
  })
}
```

**Example - Item View:**
```typescript
// User views product details
await recordInteraction({
  userId: user.id,
  type: 'view_item',
  key: item.sku,
  value: {
    name: item.name,
    category: item.category,
    price: item.price
  }
})
```

**Example - Swap Interaction:**
```typescript
// User accepts a savings swap
await recordInteraction({
  userId: user.id,
  type: 'swap',
  key: 'accepted',
  value: {
    original: originalItem.sku,
    replacement: replacementItem.sku,
    savings: savingsAmount
  }
})

// User rejects a swap
await recordInteraction({
  userId: user.id,
  type: 'reject_swap',
  key: 'rejected',
  value: {
    original: originalItem.sku,
    replacement: replacementItem.sku,
    reason: 'brand_preference' // Optional
  }
})
```

**Example - Feature Usage:**
```typescript
// Track voice usage
await recordInteraction({
  userId: user.id,
  type: 'voice_used',
  key: 'voice_input',
  value: {
    duration_seconds: recordingDuration,
    success: transcriptionSucceeded
  }
})
```

---

### 4. fetchMemoryContext()

**Purpose:** Retrieve memory context for AI prompt injection

**Signature:**
```typescript
async function fetchMemoryContext(params: FetchMemoryContextParams): Promise<MemoryContext | null>

interface FetchMemoryContextParams {
  userId: string
  minConfidence?: number // Defaults to 0.70
}

interface MemoryContext {
  dietary?: Array<{ key: string, confidence: number, reason?: string, times_confirmed: number }>
  brand?: Array<{ key: string, confidence: number, reason?: string, times_confirmed: number }>
  favorite?: Array<{ key: string, confidence: number, reason?: string, times_confirmed: number }>
  dislike?: Array<{ key: string, confidence: number, reason?: string, times_confirmed: number }>
  allergy?: Array<{ key: string, confidence: number, reason?: string, times_confirmed: number }>
  insights?: Array<{ type: string, key: string, value: string, confidence: number }>
}
```

**Behavior:**
- Fetches all preferences with confidence >= minConfidence
- Groups by preference type
- Orders by confidence DESC, times_confirmed DESC
- Returns null if error or no data

**Example - Basic Usage:**
```typescript
const [memoryContext, setMemoryContext] = useState<MemoryContext | null>(null)

useEffect(() => {
  const loadMemory = async () => {
    const context = await fetchMemoryContext({
      userId: user.id,
      minConfidence: 0.70 // Only high-confidence preferences
    })
    setMemoryContext(context)
  }

  loadMemory()
}, [user.id])
```

**Example - Refresh After Order:**
```typescript
useEffect(() => {
  const loadMemory = async () => {
    const context = await fetchMemoryContext({ userId: user.id })
    setMemoryContext(context)
  }

  loadMemory()
}, [user.id, orders.length]) // Refresh when orders change
```

**Example - Use in AI Call:**
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: chatMessages,
    system: SYSTEM_PROMPT(userProfile, memoryContext) // Inject memory
  })
})
```

---

## Data Collection Patterns

### Pattern 1: Passive Learning (Recommended)

**Use Case:** Collect data during normal user interactions without blocking UX

```typescript
const addToCart = useCallback((item: CartItem) => {
  // 1. Update UI immediately (synchronous)
  setCart(prev => [...prev, item])

  // 2. Record interaction asynchronously (non-blocking)
  recordInteraction({
    userId: user.id,
    type: 'view_item',
    key: item.sku,
    value: { name: item.name, category: item.category }
  }).catch(console.error) // Fail silently, don't block UX

  // 3. Learn patterns asynchronously
  const itemCount = cart.filter(i => i.sku === item.sku).length + 1
  if (itemCount >= 3) {
    upsertPreference({
      userId: user.id,
      type: 'favorite',
      key: item.sku,
      confidence: Math.min(0.95, 0.50 + (itemCount * 0.08))
    }).catch(console.error)
  }
}, [user.id, cart])
```

**Key Points:**
- UI updates happen first (synchronous)
- Memory operations use `.catch(console.error)` to fail silently
- No loading states needed
- No user-facing errors

---

### Pattern 2: Explicit Collection

**Use Case:** User explicitly provides information

```typescript
const handleDietaryForm = async (dietaryRestriction: string) => {
  setLoading(true)

  try {
    // Explicit = 100% confidence
    await upsertPreference({
      userId: user.id,
      type: 'dietary',
      key: dietaryRestriction,
      confidence: 1.0,
      reason: 'User selected in profile settings',
      source: 'explicit'
    })

    toast.success('Dietary preference saved!')
  } catch (error) {
    toast.error('Failed to save preference')
    console.error(error)
  } finally {
    setLoading(false)
  }
}
```

**Key Points:**
- Use loading states
- Show error messages
- Set confidence = 1.0
- Use source = 'explicit'

---

### Pattern 3: Batch Collection

**Use Case:** Collect multiple data points at once (e.g., during checkout)

```typescript
const handleCheckout = async () => {
  // ... complete checkout ...

  if (orderSuccess) {
    // Collect all patterns in parallel
    const memoryPromises = [
      updatePattern({
        userId: user.id,
        type: 'time_of_day',
        key: getCurrentTimePeriod()
      }),
      updatePattern({
        userId: user.id,
        type: 'day_of_week',
        key: getCurrentDayOfWeek()
      }),
      updatePattern({
        userId: user.id,
        type: 'basket_size',
        key: getBasketSizeCategory(cart.length),
        value: { item_count: cart.length, total }
      }),
      ...cart.map(item =>
        updatePattern({
          userId: user.id,
          type: 'category_preference',
          key: item.category,
          value: { quantity: item.quantity, price: item.price }
        })
      )
    ]

    // Fire and forget (don't await)
    Promise.all(memoryPromises).catch(console.error)
  }
}
```

**Key Points:**
- Use Promise.all() for parallel execution
- Don't await (non-blocking)
- Catch errors silently

---

## AI Context Injection

### Step 1: Fetch Memory Context

```typescript
import { fetchMemoryContext } from '@/lib/memory'
import type { MemoryContext } from '@/types/memory'

const [memoryContext, setMemoryContext] = useState<MemoryContext | null>(null)

useEffect(() => {
  const loadMemory = async () => {
    const context = await fetchMemoryContext({
      userId: user.id,
      minConfidence: 0.70
    })
    setMemoryContext(context)
  }

  loadMemory()
}, [user.id, orders.length])
```

### Step 2: Update System Prompt

```typescript
import { SYSTEM_PROMPT } from '@/lib/prompts'

// In your API call
const systemPrompt = SYSTEM_PROMPT(userProfile, memoryContext)

const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: chatHistory,
    system: systemPrompt // Includes memory context
  })
})
```

### Step 3: System Prompt Integration

The `SYSTEM_PROMPT` function in `src/lib/prompts.ts` automatically formats memory context:

```typescript
export function SYSTEM_PROMPT(profile: any, memoryContext?: MemoryContext | null): string {
  // ... base prompt ...

  let memorySection = ''
  if (memoryContext) {
    memorySection = '\n## Customer Memory (Personalization Data)\n'

    // Dietary preferences
    if (memoryContext.dietary?.length) {
      memorySection += '\n### Dietary Preferences:\n'
      memoryContext.dietary.forEach(pref => {
        memorySection += `- ${pref.key} (confidence: ${(pref.confidence * 100).toFixed(0)}%)\n`
      })
    }

    // Allergies (CRITICAL)
    if (memoryContext.allergy?.length) {
      memorySection += '\n### Allergies (CRITICAL - NEVER suggest these):\n'
      memoryContext.allergy.forEach(pref => {
        memorySection += `- ⚠️ ${pref.key.toUpperCase()}\n`
      })
    }

    // ... favorites, brands, dislikes, insights ...
  }

  return basePrompt + memorySection
}
```

---

## Helper Utilities

### Time Period Detection

```typescript
import { getCurrentTimePeriod } from '@/lib/memory'

const period = getCurrentTimePeriod()
// Returns: 'morning' (5am-12pm), 'afternoon' (12pm-5pm),
//          'evening' (5pm-10pm), 'night' (10pm-5am)
```

### Day of Week Detection

```typescript
import { getCurrentDayOfWeek } from '@/lib/memory'

const day = getCurrentDayOfWeek()
// Returns: 'monday', 'tuesday', 'wednesday', etc.
```

### Basket Size Categorization

```typescript
import { getBasketSizeCategory } from '@/lib/memory'

const size = getBasketSizeCategory(15)
// Returns: 'small' (≤5), 'medium' (6-15), 'large' (16-30), 'bulk' (>30)
```

### Dietary Restriction Extraction

```typescript
import { extractDietaryRestriction } from '@/lib/memory'

const restriction = extractDietaryRestriction("I'm vegan and need plant-based options")
// Returns: 'vegan'

// Detects: vegetarian, vegan, gluten_free, dairy_free, nut_free, keto, paleo, halal, kosher
```

### Allergy Extraction

```typescript
import { extractAllergy } from '@/lib/memory'

const allergy = extractAllergy("I'm allergic to peanuts")
// Returns: 'peanuts'

// Detects: peanuts, tree_nuts, dairy, eggs, soy, wheat, fish, shellfish
```

---

## Best Practices

### 1. Always Use Async/Non-Blocking

```typescript
// ✅ GOOD: Non-blocking
recordInteraction({...}).catch(console.error)

// ❌ BAD: Blocking
await recordInteraction({...})
```

### 2. Fail Silently for Passive Learning

```typescript
// ✅ GOOD: Silent failure
upsertPreference({...}).catch(console.error)

// ❌ BAD: User-facing error
try {
  await upsertPreference({...})
} catch (error) {
  toast.error('Failed to save preference') // Don't show for passive learning
}
```

### 3. Use High Confidence for Explicit Data

```typescript
// ✅ GOOD: User explicitly stated
upsertPreference({
  type: 'allergy',
  key: 'shellfish',
  confidence: 1.0, // 100% confidence
  source: 'explicit'
})

// ❌ BAD: Should use lower confidence
upsertPreference({
  type: 'brand',
  key: 'guessed_from_one_click',
  confidence: 1.0 // Too high for inference
})
```

### 4. Provide Meaningful Reasons

```typescript
// ✅ GOOD: Context helps debugging
upsertPreference({
  type: 'favorite',
  key: 'milk-whole-gal',
  reason: 'Added to cart 5 times over 3 shopping sessions'
})

// ❌ BAD: No context
upsertPreference({
  type: 'favorite',
  key: 'milk-whole-gal',
  reason: 'Favorite item' // Too generic
})
```

### 5. Refresh Memory After Major Events

```typescript
// ✅ GOOD: Refresh after checkout
useEffect(() => {
  fetchMemoryContext({ userId: user.id })
    .then(setMemoryContext)
}, [user.id, orders.length]) // Dependency on orders

// ❌ BAD: Only fetch once on mount
useEffect(() => {
  fetchMemoryContext({ userId: user.id })
    .then(setMemoryContext)
}, []) // Missing dependencies
```

---

## Common Patterns

### Detecting User Intent from Messages

```typescript
const sendMessage = async (message: string) => {
  const lower = message.toLowerCase()

  // Detect dietary restrictions
  const dietary = extractDietaryRestriction(message)
  if (dietary) {
    upsertPreference({
      userId: user.id,
      type: 'dietary',
      key: dietary,
      confidence: 1.0,
      reason: `User said: "${message.substring(0, 100)}"`,
      source: 'explicit'
    }).catch(console.error)
  }

  // Detect allergies
  const allergy = extractAllergy(message)
  if (allergy) {
    upsertPreference({
      userId: user.id,
      type: 'allergy',
      key: allergy,
      confidence: 1.0,
      reason: `User said: "${message.substring(0, 100)}"`,
      source: 'explicit'
    }).catch(console.error)
  }

  // Detect brand mentions
  if (lower.includes('prefer') && lower.includes('brand')) {
    // Custom brand extraction logic
  }

  // Track question interactions
  if (message.includes('?')) {
    recordInteraction({
      userId: user.id,
      type: 'question',
      key: 'query',
      value: { query: message.substring(0, 200) }
    }).catch(console.error)
  }

  // Send to AI...
}
```

### Learning from Swaps

```typescript
const handleSwap = (original: CartItem, replacement: CartItem) => {
  // Update cart
  setCart(prev => prev.map(item =>
    item.sku === original.sku ? replacement : item
  ))

  // Learn from swap acceptance
  recordInteraction({
    userId: user.id,
    type: 'swap',
    key: 'accepted',
    value: { original: original.sku, replacement: replacement.sku }
  }).catch(console.error)

  // Extract brand preference
  const brandMatch = replacement.name.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/)
  if (brandMatch) {
    upsertPreference({
      userId: user.id,
      type: 'brand',
      key: brandMatch[1].toLowerCase(),
      confidence: 0.65,
      reason: 'Accepted savings swap',
      source: 'pattern'
    }).catch(console.error)
  }
}
```

### Tracking Repeat Purchases

```typescript
const addToCart = (item: CartItem) => {
  setCart(prev => {
    const existing = prev.find(i => i.sku === item.sku)

    // Record view
    recordInteraction({
      userId: user.id,
      type: 'view_item',
      key: item.sku,
      value: { name: item.name, category: item.category }
    }).catch(console.error)

    // Track as favorite if added multiple times
    if (existing) {
      const newCount = existing.quantity + item.quantity
      if (newCount >= 3) {
        upsertPreference({
          userId: user.id,
          type: 'favorite',
          key: item.sku,
          confidence: Math.min(0.95, 0.50 + (newCount * 0.08)),
          reason: `Added to cart ${newCount} times`,
          source: 'pattern'
        }).catch(console.error)
      }
      return prev.map(i => i.sku === item.sku ? { ...i, quantity: newCount } : i)
    }

    return [...prev, item]
  })
}
```

---

## Debugging

### Check Memory in Supabase

```sql
-- View all preferences for a user
SELECT * FROM customer_preferences WHERE user_id = 'USER_ID';

-- View memory context
SELECT * FROM fetch_memory_context('USER_ID', 0.70);

-- Check recent interactions
SELECT * FROM interaction_history
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC
LIMIT 20;

-- View shopping patterns
SELECT * FROM shopping_patterns
WHERE user_id = 'USER_ID'
ORDER BY confidence DESC;
```

### Check Memory in Browser Console

```javascript
// In React DevTools
// 1. Find ChatInterface component
// 2. Check memoryContext state
// 3. Should see object with dietary, allergy, favorite, brand arrays

// Or add temporary logging
console.log('Memory Context:', memoryContext)
```

### Check Memory in API Requests

```javascript
// In Network tab:
// 1. Find POST request to /api/chat
// 2. Check Request Payload → system
// 3. Should see "## Customer Memory" section with your preferences
```

---

## Performance Considerations

### Database Indexes

All critical paths are indexed:
- `customer_preferences`: (user_id, preference_type), (user_id, confidence)
- `shopping_patterns`: (user_id, pattern_type), (user_id, confidence)
- `interaction_history`: (user_id, interaction_type), (user_id, created_at)

### RPC Function Performance

All functions use `SECURITY DEFINER` for consistent performance:
- `upsert_preference`: ~5-10ms
- `update_pattern`: ~5-10ms
- `record_interaction`: ~3-5ms (insert only)
- `fetch_memory_context`: ~15-25ms (aggregation query)

### Client-Side Optimization

```typescript
// ✅ GOOD: Debounce frequent operations
const debouncedRecordView = useCallback(
  debounce((item: CartItem) => {
    recordInteraction({
      userId: user.id,
      type: 'view_item',
      key: item.sku
    }).catch(console.error)
  }, 1000),
  [user.id]
)

// ✅ GOOD: Batch related operations
Promise.all([
  updatePattern({...}),
  updatePattern({...}),
  recordInteraction({...})
]).catch(console.error)
```

---

## Next Steps

- **Phase 1**: Advanced features (see MEMORY-SYSTEM-SCHEMA.md)
- **Phase 2**: Memory management UI
- **Phase 3**: Analytics dashboard
- **Phase 4**: ML-based insights

---

**Questions?** See MEMORY-SYSTEM-TESTING.md for testing guide or MEMORY-SYSTEM-SCHEMA.md for architecture details.
