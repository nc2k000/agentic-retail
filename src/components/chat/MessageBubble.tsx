'use client'

import { Message, CartItem, ShoppingList } from '@/types'
import { ShopBlock } from '@/components/blocks/ShopBlock'
import { SavingsBlock } from '@/components/blocks/SavingsBlock'
import { SuggestionChips } from '@/components/blocks/SuggestionChips'
import { LoadingIndicator } from '@/components/ui/LoadingIndicator'

interface MessageBubbleProps {
  message: Message
  onAddToCart: (item: CartItem) => void
  onAddAllToCart: (items: CartItem[]) => void
  onFindSavings: (items: CartItem[], title: string) => void
  onSwap: (original: CartItem, replacement: CartItem) => void
  onSendMessage: (message: string) => void
  activeList: ShoppingList | null
  onUpdateActiveList: (list: ShoppingList | null) => void
}

export function MessageBubble({
  message,
  onAddToCart,
  onAddAllToCart,
  onFindSavings,
  onSwap,
  onSendMessage,
  activeList,
  onUpdateActiveList,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.isStreaming

  // Extract text content (remove block markers)
  const textContent = message.content
    .replace(/```\w*\n[\s\S]*?```/g, '')
    .trim()

  // Get blocks
  const blocks = message.blocks || []

  // Separate intro text from blocks
  const introText = textContent.split('\n')[0]
  const hasBlocks = blocks.length > 0

  return (
    <div className={`px-4 py-3 ${isUser ? 'bg-stone-50' : ''}`}>
      <div className="flex gap-3 max-w-3xl mx-auto">
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
                  // TODO: Add more block types (recipe, upsell, comparison, etc.)
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
