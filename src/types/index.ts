// Product & Catalog Types
export interface Product {
  sku: string
  name: string
  price: number
  category: string
  image: string
  tags?: string[]
  bulkDeal?: BulkDeal
}

export interface BulkDeal {
  qty: number
  price: number
  savings: number
}

export interface CartItem extends Product {
  quantity: number
  source?: 'chat' | 'upsell' | 'savings' | 'recipe' | 'reorder' | 'essentials'
  addedAt?: string
  isSwapped?: boolean
  reason?: string
}

// Shopping List Types
export interface ShoppingList {
  id: string
  title: string
  items: ShoppingListItem[]
  source: 'chat' | 'recipe' | 'outcome' | 'reorder'
  createdAt: string
  updatedAt?: string
}

export interface ShoppingListItem extends Product {
  quantity: number
  checked?: boolean
  savedAmount?: number
  source?: 'chat' | 'upsell' | 'savings' | 'recipe' | 'reorder' | 'essentials'
  isSwapped?: boolean
  reason?: string
}

// Message & Chat Types
export type MessageContent =
  | string
  | Array<{
      type: 'text' | 'image'
      text?: string
      source?: {
        type: 'base64'
        media_type: string
        data: string
      }
    }>

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  multimodalContent?: MessageContent
  blocks?: Block[]
  createdAt: string
  isStreaming?: boolean
}

export type BlockType =
  | 'shop'
  | 'recipe'
  | 'outcome'
  | 'savings'
  | 'cart'
  | 'upsell'
  | 'comparison'
  | 'compare'
  | 'products'
  | 'suggestions'
  | 'order'
  | 'bulkdeal'

export interface Block {
  type: BlockType
  data: any
}

export interface ShopBlock {
  type: 'shop'
  data: {
    title: string
    items: ShoppingListItem[]
    source?: string
  }
}

export interface RecipeBlock {
  type: 'recipe'
  data: {
    title: string
    servings?: number
    prepTime?: string
    cookTime?: string
    ingredients: RecipeIngredient[]
    instructions?: string[]
    sourceUrl?: string
  }
}

export interface RecipeIngredient {
  name: string
  amount?: string
  unit?: string
  sku?: string
  price?: number
  image?: string
}

export interface SavingsBlock {
  type: 'savings'
  data: {
    listTitle: string
    originalItems: ShoppingListItem[]
    swaps: SavingsSwap[]
    totalSavings: number
  }
}

export interface SavingsSwap {
  original: Product
  replacement: Product
  savings: number
  reason?: string
}

export interface UpsellBlock {
  type: 'upsell'
  data: {
    inference?: string
    complementary: UpsellItem[]
    options?: UpsellOption[]
  }
}

export interface UpsellItem extends Product {
  reason?: string
}

export interface UpsellOption {
  type: 'recipe' | 'outcome' | 'essentials'
  label: string
  prompt: string
}

export interface SuggestionChip {
  label: string
  prompt: string
}

export interface OrderBlock {
  type: 'order'
  data: {
    orderNumber: string
    items: CartItem[]
    total: number
    itemCount: number
    status: 'confirmed' | 'pending'
    estimatedDelivery?: string
    pickupReady?: string
  }
}

export interface BulkDealOpportunity {
  item: CartItem
  bulkDeal: BulkDeal
  additionalQty: number
  totalSavings: number
  message: string
}

export interface BulkDealBlock {
  type: 'bulkdeal'
  data: {
    opportunities: BulkDealOpportunity[]
    totalPotentialSavings: number
  }
}

// User & Profile Types
export interface UserProfile {
  id: string
  email: string
  name?: string
  household: Household
  preferences: UserPreferences
  createdAt: string
  updatedAt?: string
}

export interface Household {
  size: number
  members: HouseholdMember[]
  pets?: Pet[]
}

export interface HouseholdMember {
  id: string // unique ID for attribution
  name: string
  relationship: 'self' | 'partner' | 'spouse' | 'child' | 'parent' | 'other'
  age?: number
  dietary?: string[] // quick reference for dietary preferences
  allergies?: string[] // critical reference for allergies
  dietaryRestrictions?: string[] // backward compatibility
}

export interface Pet {
  type: string
  name?: string
}

export interface UserPreferences {
  brands: string[]
  dietary: string[]
  budget?: 'budget' | 'moderate' | 'premium'
  stores?: string[]
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
  deliveredAt?: string
}

// Mission Types
export interface Mission {
  id: string
  userId: string
  query: string
  type: 'essentials' | 'recipe' | 'event' | 'research' | 'precision'
  status: 'active' | 'completed' | 'abandoned'
  startedAt: string
  completedAt?: string

  // Funnel state (missions ARE funnels)
  funnelStage: FunnelStage
  itemsViewed: number
  itemsAdded: number
  questionsAsked: number

  // Mission lifecycle
  expectedNextAction?: string
  lastActiveAt: string
  pausedAt?: string
  abandonedAt?: string
  abandonThresholdHours: number

  // Context
  detectedAt: string
  detectionConfidence: number
  items?: CartItem[]
}

// Subscription Types
export type SubscriptionFrequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'

export interface Subscription {
  id: string
  userId: string
  productSku: string
  product: Product
  quantity: number
  frequency: SubscriptionFrequency
  discount: number // percentage (e.g., 10 for 10%)
  status: 'active' | 'paused' | 'cancelled'
  nextDelivery: string // ISO date string
  createdAt: string
  updatedAt?: string
  pausedAt?: string
  cancelledAt?: string
}

export interface SubscriptionSuggestion {
  product: Product
  reason: string
  suggestedFrequency: SubscriptionFrequency
  potentialSavings: number // monthly savings
  confidence: 'high' | 'medium' | 'low'
  orderCount?: number // number of times ordered (optional, for sorting)
}

// Database Types (for Supabase)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'createdAt' | 'updatedAt'>
        Update: Partial<Omit<UserProfile, 'id' | 'createdAt'>>
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: CartItem[]
          total: number
          status: string
          created_at: string
          delivered_at?: string | null
        }
        Insert: {
          user_id: string
          items: CartItem[]
          total: number
          status: string
          delivered_at?: string | null
        }
        Update: Partial<{
          items: CartItem[]
          total: number
          status: string
          delivered_at: string | null
        }>
      }
      shopping_lists: {
        Row: {
          id: string
          user_id: string
          title: string
          items: ShoppingListItem[]
          source: 'chat' | 'recipe' | 'outcome' | 'reorder'
          created_at: string
          updated_at?: string | null
        }
        Insert: {
          user_id: string
          title: string
          items: ShoppingListItem[]
          source: 'chat' | 'recipe' | 'outcome' | 'reorder'
        }
        Update: Partial<{
          title: string
          items: ShoppingListItem[]
          updated_at: string
        }>
      }
      missions: {
        Row: Mission
        Insert: Omit<Mission, 'id' | 'startedAt'>
        Update: Partial<Omit<Mission, 'id' | 'userId' | 'startedAt'>>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          product_sku: string
          product: Product
          quantity: number
          frequency: SubscriptionFrequency
          discount: number
          status: 'active' | 'paused' | 'cancelled'
          next_delivery: string
          created_at: string
          updated_at?: string | null
          paused_at?: string | null
          cancelled_at?: string | null
        }
        Insert: {
          user_id: string
          product_sku: string
          product: Product
          quantity: number
          frequency: SubscriptionFrequency
          discount: number
          status: 'active' | 'paused' | 'cancelled'
          next_delivery: string
        }
        Update: Partial<{
          quantity: number
          frequency: SubscriptionFrequency
          status: 'active' | 'paused' | 'cancelled'
          next_delivery: string
          updated_at: string
          paused_at: string | null
          cancelled_at: string | null
        }>
      }
    }
  }
}

// Funnel & Journey Types
export type FunnelStage = 'arriving' | 'browsing' | 'comparing' | 'decided' | 'checkout'

export interface FunnelState {
  stage: FunnelStage
  enteredAt: string
  actions: string[]
  itemsViewed: number
  itemsAdded: number
  questionsAsked: number
}

export interface FunnelTransition {
  from: FunnelStage
  to: FunnelStage
  trigger: string
  timestamp: string
}

// Verbosity & Communication Types
export type VerbosityLevel = 'concise' | 'balanced' | 'detailed'

export interface CommunicationPreference {
  verbosity: VerbosityLevel
  confidence: number
  learnedFrom: 'explicit' | 'behavior'
  updatedAt: string
}
