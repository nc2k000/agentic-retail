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
  source?: 'chat' | 'upsell' | 'savings' | 'recipe' | 'reorder'
  addedAt?: string
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
  | 'products' 
  | 'suggestions' 
  | 'order'

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
  name: string
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'other'
  age?: number
  dietaryRestrictions?: string[]
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
        Row: ShoppingList & { userId: string }
        Insert: Omit<ShoppingList, 'id' | 'createdAt'> & { userId: string }
        Update: Partial<Omit<ShoppingList, 'id' | 'createdAt'>>
      }
      missions: {
        Row: Mission
        Insert: Omit<Mission, 'id' | 'startedAt'>
        Update: Partial<Omit<Mission, 'id' | 'userId' | 'startedAt'>>
      }
    }
  }
}
