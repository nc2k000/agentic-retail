'use client'

import { Message, CartItem, ShoppingList } from '@/types'
import { ShopBlock } from '@/components/blocks/ShopBlock'
import { SavingsBlock } from '@/components/blocks/SavingsBlock'
import { RecipeBlock } from '@/components/blocks/RecipeBlock'
import { OrderBlock } from '@/components/blocks/OrderBlock'
import { UpsellBlock } from '@/components/blocks/UpsellBlock'
import { BulkDealBlock } from '@/components/blocks/BulkDealBlock'
import { CompareBlock } from '@/components/blocks/CompareBlock'
import { SuggestionChips } from '@/components/blocks/SuggestionChips'
import { LoadingIndicator, SkeletonShopBlock } from '@/components/ui/LoadingIndicator'
import { extractTextContent } from '@/lib/parser'

interface MessageBubbleProps {
  message: Message
  onAddToCart: (item: CartItem) => void
  onAddAllToCart: (items: CartItem[]) => void
  onFindSavings: (items: CartItem[], title: string) => void
  onSwap: (original: CartItem, replacement: CartItem) => void
  onSwapAll?: (swaps: Array<{original: CartItem, replacement: CartItem}>) => void
  onSendMessage: (message: string) => void
  onUpdateCartQuantity: (sku: string, quantity: number) => void
  activeList: ShoppingList | null
  onUpdateActiveList: (list: ShoppingList | null) => void
  cart: CartItem[]
}

export function MessageBubble({
  message,
  onAddToCart,
  onAddAllToCart,
  onFindSavings,
  onSwap,
  onSwapAll,
  onSendMessage,
  onUpdateCartQuantity,
  activeList,
  onUpdateActiveList,
  cart,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.isStreaming

  // Extract text content (remove block markers including during streaming)
  const textContent = extractTextContent(message.content)

  // Get blocks
  const blocks = message.blocks || []

  // Separate intro text from blocks
  const introText = textContent.split('\n')[0]
  const hasBlocks = blocks.length > 0

  return (
    <div className={`px-2 sm:px-4 py-3 ${isUser ? 'bg-stone-50' : ''}`}>
      <div className="flex gap-2 sm:gap-3 max-w-3xl mx-auto min-w-0">
        {/* Avatar */}
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 flex-shrink-0">
            👤
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            A
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isUser ? (
            <p className="text-stone-800">{message.content}</p>
          ) : (
            <>
              {/* Streaming cursor */}
              {isStreaming && !textContent && <LoadingIndicator />}

              {/* Text content */}
              {textContent && (
                <div className="prose prose-stone prose-sm max-w-none">
                  {hasBlocks ? (
                    <p className="text-stone-800">{introText}</p>
                  ) : (
                    <p className="text-stone-800 whitespace-pre-wrap">{textContent}</p>
                  )}
                </div>
              )}

              {/* Streaming cursor at end of text */}
              {isStreaming && textContent && (
                <span className="inline-block w-2 h-4 bg-amber-500 animate-pulse ml-1" />
              )}

              {/* Show skeleton while streaming if creating a list */}
              {isStreaming && blocks.length === 0 && textContent && (
                textContent.toLowerCase().includes('list') ||
                textContent.toLowerCase().includes('shop') ||
                textContent.toLowerCase().includes('item')
              ) && <SkeletonShopBlock />}

              {/* Blocks */}
              {blocks.map((block, i) => {
                switch (block.type) {
                  case 'shop':
                    return (
                      <ShopBlock
                        key={i}
                        data={block.data}
                        onAddToCart={onAddToCart}
                        onAddAllToCart={onAddAllToCart}
                        onFindSavings={() => onFindSavings(block.data.items, block.data.title)}
                        activeList={activeList}
                        onUpdateActiveList={onUpdateActiveList}
                      />
                    )
                  case 'savings':
                    return (
                      <SavingsBlock
                        key={i}
                        data={block.data}
                        onSwap={onSwap}
                        onAddToCart={onAddToCart}
                        onSwapAll={onSwapAll}
                      />
                    )
                  case 'recipe':
                    return (
                      <RecipeBlock
                        key={i}
                        data={block.data}
                      />
                    )
                  case 'suggestions':
                    return (
                      <SuggestionChips
                        key={i}
                        chips={block.data.chips || block.data}
                        onSelect={onSendMessage}
                      />
                    )
                  case 'order':
                    return (
                      <OrderBlock
                        key={i}
                        data={block.data}
                      />
                    )
                  case 'upsell':
                    return (
                      <UpsellBlock
                        key={i}
                        data={block.data}
                        onAddToCart={onAddToCart}
                      />
                    )
                  case 'bulkdeal':
                    return (
                      <BulkDealBlock
                        key={i}
                        data={block.data}
                        onAddQuantity={(sku, additionalQty) => {
                          const currentItem = cart.find(item => item.sku === sku)
                          if (currentItem) {
                            onUpdateCartQuantity(sku, currentItem.quantity + additionalQty)
                          }
                        }}
                      />
                    )
                  case 'compare':
                    return (
                      <CompareBlock
                        key={i}
                        data={block.data}
                        onAddToCart={onAddToCart}
                      />
                    )
                  default:
                    return null
                }
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
