'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { Message, CartItem, ShoppingList, Order, Block, MessageContent } from '@/types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { CartSidebar } from './CartSidebar'
import { Header } from './Header'
import { WelcomeScreen } from './WelcomeScreen'
import { parseBlocks } from '@/lib/parser'
import { SYSTEM_PROMPT } from '@/lib/prompts'
import { createClient } from '@/lib/supabase/client'

interface ChatInterfaceProps {
  user: User
  profile: any
  initialOrders: Order[]
  initialLists: ShoppingList[]
}

export function ChatInterface({ user, profile, initialOrders, initialLists }: ChatInterfaceProps) {
  // Core state
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeList, setActiveList] = useState<ShoppingList | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Additional state
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [recentLists, setRecentLists] = useState<ShoppingList[]>(initialLists)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Send message to Claude
  const sendMessage = useCallback(async (content: string, multimodalContent?: MessageContent) => {
    const isSystemMessage = content.startsWith('[SYSTEM]')
    const displayContent = content

    // Add user message to UI (skip system messages)
    if (!isSystemMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: displayContent,
        multimodalContent,
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, userMessage])
    }
    setIsLoading(true)

    // Create streaming assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isStreaming: true,
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      // Build message history for API
      const apiMessages = messages.map(m => {
        // Use multimodal content if available, otherwise use text content
        if (m.multimodalContent) {
          return {
            role: m.role,
            content: m.multimodalContent,
          }
        }
        return {
          role: m.role,
          content: m.content,
        }
      })

      // Handle current message - multimodal or text with active list context
      let currentMessageContent: MessageContent
      if (multimodalContent) {
        currentMessageContent = multimodalContent
      } else {
        // Text message with optional active list context
        let textContent = content
        if (activeList && activeList.items && activeList.items.length > 0) {
          const listContext = `\n\n[IMPORTANT - CURRENT LIST STATE]\nThe user's "${activeList.title}" has been EDITED since it was created.\nIGNORE any previous shop blocks - use THIS as the authoritative list:\n${activeList.items.map(i => `- ${i.name} (×${i.quantity || 1})`).join('\n')}\n\nIf the user asks to add something already on this list, help them. If they ask about something NOT on this list, it has been REMOVED - do not say it's already there.`
          textContent += listContext
        }
        currentMessageContent = textContent
      }

      apiMessages.push({ role: 'user', content: currentMessageContent })

      // Call streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          system: SYSTEM_PROMPT(profile),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                fullContent += parsed.text
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessage.id 
                      ? { ...m, content: fullContent }
                      : m
                  )
                )
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Parse blocks from final content
      const blocks = parseBlocks(fullContent)
      
      // Finalize message
      setMessages(prev => 
        prev.map(m => 
          m.id === assistantMessage.id 
            ? { ...m, content: fullContent, blocks, isStreaming: false }
            : m
        )
      )

      // Handle shop blocks - set as active list and save to DB
      const shopBlocks = blocks.filter(b => b.type === 'shop')
      if (shopBlocks.length > 0) {
        const shopData = shopBlocks[shopBlocks.length - 1].data
        const newList: ShoppingList = {
          id: Date.now().toString(),
          title: shopData.title || 'Shopping List',
          items: shopData.items || [],
          source: shopData.source || 'chat',
          createdAt: new Date().toISOString(),
        }
        setActiveList(newList)

        // Save to Supabase
        saveListToDatabase(newList)
      }

      // Handle order blocks - save to DB
      const orderBlocks = blocks.filter(b => b.type === 'order')
      if (orderBlocks.length > 0) {
        // Checkout was completed
        const orderData = orderBlocks[0].data
        await saveOrder(orderData)
        setCart([]) // Clear cart
      }

      // Voice output if enabled
      if (voiceEnabled && fullContent) {
        speakResponse(fullContent, blocks)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => 
        prev.map(m => 
          m.id === assistantMessage.id 
            ? { ...m, content: 'Sorry, something went wrong. Please try again.', isStreaming: false }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [messages, activeList, profile, voiceEnabled])

  // Save shopping list to database
  const saveListToDatabase = useCallback(async (list: ShoppingList) => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          user_id: user.id,
          title: list.title,
          items: list.items as any,
          source: list.source,
        } as any)
        .select()
        .single()

      if (!error && data) {
        // Update list with database ID
        const savedList = {
          ...list,
          id: (data as any).id,
        }
        setActiveList(savedList)
        setRecentLists(prev => [savedList, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error('Failed to save list:', error)
    }
  }, [user.id])

  // Update shopping list in database
  const updateListInDatabase = useCallback(async (list: ShoppingList) => {
    try {
      const supabase = createClient()

      await supabase
        .from('shopping_lists')
        // @ts-expect-error - Supabase type inference has issues with JSONB update
        .update({
          items: list.items,
          updated_at: new Date().toISOString(),
        })
        .eq('id', list.id)

      // Update recent lists
      setRecentLists(prev =>
        prev.map(l => l.id === list.id ? list : l)
      )
    } catch (error) {
      console.error('Failed to update list:', error)
    }
  }, [])

  // Watch for active list changes and persist them
  useEffect(() => {
    if (activeList && activeList.id && !activeList.id.startsWith('temp-')) {
      // Only update if list has a real database ID (not temporary timestamp)
      const hasDbId = activeList.id.length > 15 // DB IDs are UUIDs
      if (hasDbId) {
        updateListInDatabase(activeList)
      }
    }
  }, [activeList, updateListInDatabase])

  // Add item to cart
  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.sku === item.sku)
      if (existing) {
        return prev.map(i => 
          i.sku === item.sku 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }, [])

  // Remove item from cart
  const removeFromCart = useCallback((sku: string) => {
    setCart(prev => prev.filter(i => i.sku !== sku))
  }, [])

  // Update cart item quantity
  const updateCartQuantity = useCallback((sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku)
    } else {
      setCart(prev => prev.map(i => 
        i.sku === sku ? { ...i, quantity } : i
      ))
    }
  }, [removeFromCart])

  // Add all items from a list to cart
  const addAllToCart = useCallback((items: CartItem[]) => {
    items.forEach(item => addToCart(item))
  }, [addToCart])

  // Save order to database (called when Claude returns order block)
  const saveOrder = async (orderData: any) => {
    const supabase = createClient()
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        items: cart as any,
        total,
        status: 'confirmed',
      } as any)
      .select()
      .single()

    if (!error && data) {
      setOrders(prev => [data as Order, ...prev])
    }
  }

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) {
      return
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    // Save order to database
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: cart as any,
          total,
          status: 'confirmed',
        } as any)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setOrders(prev => [data as Order, ...prev])

        // Silently trigger order confirmation (don't add user message to chat)
        sendMessage(`[SYSTEM] Generate order confirmation for order #${(data as any).id} with ${itemCount} items, total $${total.toFixed(2)}`)

        // Clear cart
        setCart([])
        setIsCartOpen(false)
      }
    } catch (error: any) {
      console.error('Checkout failed:', error)
      // Still show confirmation even if DB save failed (for demo purposes)
      sendMessage(`Checkout my cart with ${itemCount} items totaling $${total.toFixed(2)}`)
      setIsCartOpen(false)
    }
  }, [cart, sendMessage, user.id])

  // Find savings on current list/cart
  const handleFindSavings = useCallback((items: CartItem[], title: string) => {
    sendMessage(
      `[SYSTEM] Find savings on "${title}" with ${items.length} items. Generate a savings block with store brand alternatives.`
    )
  }, [sendMessage])

  // Handle swap in savings - request Claude to generate new list with swap
  const handleSwap = useCallback((original: CartItem, replacement: CartItem) => {
    if (!activeList) return

    // Build the updated items with swap applied
    const updatedItems = activeList.items.map(item =>
      item.sku === original.sku
        ? { ...replacement, quantity: item.quantity, source: 'savings' as const, isSwapped: true }
        : item
    )

    // Create a detailed prompt for Claude to generate a NEW list with the swap highlighted
    const itemsList = updatedItems.map(item => {
      const wasSwapped = item.sku === replacement.sku && item.isSwapped
      return `${item.name} (×${item.quantity})${wasSwapped ? ' [SWAPPED - highlight in green]' : ''}`
    }).join('\n')

    const newTitle = `${activeList.title} (with savings)`
    sendMessage(`[SYSTEM] Create a NEW shop block titled "${newTitle}" with these items:\n${itemsList}\n\nMark the 1 swapped item with green styling/badge to show it was changed for savings.`)

    // Also swap in cart if present
    setCart(prev => prev.map(item =>
      item.sku === original.sku ? { ...replacement, quantity: item.quantity } : item
    ))
  }, [activeList, sendMessage])

  // Handle swap all in savings - request Claude to generate new list with swaps
  const handleSwapAll = useCallback((swaps: Array<{original: CartItem, replacement: CartItem}>) => {
    if (!activeList) return

    // Build the updated items with swaps applied
    const updatedItems = activeList.items.map(item => {
      const swap = swaps.find(s => s.original.sku === item.sku)
      if (swap) {
        return { ...swap.replacement, quantity: item.quantity, source: 'savings' as const, isSwapped: true }
      }
      return item
    })

    // Create a detailed prompt for Claude to generate a NEW list with highlights
    const swappedSkus = swaps.map(s => s.original.sku)
    const itemsList = updatedItems.map(item => {
      const wasSwapped = swappedSkus.includes(item.sku) || item.isSwapped
      return `${item.name} (×${item.quantity})${wasSwapped ? ' [SWAPPED - highlight in green]' : ''}`
    }).join('\n')

    const newTitle = `${activeList.title} (with savings)`
    sendMessage(`[SYSTEM] Create a NEW shop block titled "${newTitle}" with these items:\n${itemsList}\n\nMark the ${swaps.length} swapped items with green styling/badges to show they were changed for savings.`)
  }, [activeList, sendMessage])

  // Voice output
  const speakResponse = (text: string, blocks: Block[]) => {
    if (!window.speechSynthesis) return
    
    // Create concise summary
    let summary = text.split('\n')[0] // First line
    
    if (blocks.length > 0) {
      const shopBlock = blocks.find(b => b.type === 'shop')
      if (shopBlock) {
        const itemCount = shopBlock.data.items?.length || 0
        const total = shopBlock.data.items?.reduce((s: number, i: any) => s + (i.price * (i.quantity || 1)), 0) || 0
        summary = `Added ${itemCount} items to ${shopBlock.data.title}, total $${total.toFixed(0)}`
      }
    }
    
    // Strip emojis
    summary = summary.replace(/[\u1F300-\u1F9FF\u2600-\u26FF\u2700-\u27BF]/g, '')
    
    const utterance = new SpeechSynthesisUtterance(summary)
    utterance.rate = 1.05
    window.speechSynthesis.speak(utterance)
  }

  // Start new chat
  const handleNewChat = useCallback(() => {
    setMessages([])
    setActiveList(null)
  }, [])

  // Sign out
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Header 
          user={user}
          profile={profile}
          cartCount={cartCount}
          cartTotal={cartTotal}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
          onOpenCart={() => setIsCartOpen(true)}
          onNewChat={handleNewChat}
          onSignOut={handleSignOut}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen 
              profile={profile}
              onSendMessage={sendMessage}
            />
          ) : (
            <div className="max-w-3xl mx-auto py-4">
              {messages.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onAddToCart={addToCart}
                  onAddAllToCart={addAllToCart}
                  onFindSavings={handleFindSavings}
                  onSwap={handleSwap}
                  onSwapAll={handleSwapAll}
                  onSendMessage={sendMessage}
                  activeList={activeList}
                  onUpdateActiveList={setActiveList}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput 
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        onFindSavings={() => handleFindSavings(cart, 'Cart')}
        onClearCart={() => setCart([])}
      />
    </div>
  )
}
