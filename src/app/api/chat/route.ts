import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Tool definition for ranking products
const tools = [
  {
    name: 'rank_products',
    description: 'Get personalized product rankings based on user preferences, purchase history, and maturity level. Use this when recommending products in carousels or answering product queries.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string' as const,
          description: 'Filter by product category (e.g., "Dairy", "Bakery", "Produce"). Optional.',
        },
        query: {
          type: 'string' as const,
          description: 'Search query for products (e.g., "milk", "bread", "organic"). Optional.',
        },
        limit: {
          type: 'number' as const,
          description: 'Maximum number of products to return. Default: 10',
        },
      },
      required: [] as string[],
    },
  },
]

export async function POST(request: NextRequest) {
  try {
    const { messages, system } = await request.json()

    // The messages array can contain either text strings or content blocks (for multimodal)
    // Claude API handles both formats automatically, so no transformation needed

    const encoder = new TextEncoder()

    // Create a ReadableStream for the response
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let currentMessages = messages
          let continueLoop = true

          while (continueLoop) {
            // Call Claude with tools
            const response = await anthropic.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 4096,
              system: system,
              messages: currentMessages,
              tools: tools,
            })

            // Check for tool use
            const toolUseBlocks = response.content.filter(
              (block: any) => block.type === 'tool_use'
            )

            if (toolUseBlocks.length > 0) {
              console.log(`🔧 Processing ${toolUseBlocks.length} tool call(s)`)

              // Execute tool calls
              const toolResults = await Promise.all(
                toolUseBlocks.map(async (toolUse: any) => {
                  if (toolUse.name === 'rank_products') {
                    const { category, query, limit = 10 } = toolUse.input

                    console.log('🎯 Calling rank_products:', { category, query, limit })

                    // Call the ranking API
                    const rankResponse = await fetch(
                      `${request.nextUrl.origin}/api/products/rank`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Cookie': request.headers.get('cookie') || '',
                        },
                        body: JSON.stringify({ category, query, limit }),
                      }
                    )

                    const rankData = await rankResponse.json()

                    return {
                      type: 'tool_result',
                      tool_use_id: toolUse.id,
                      content: JSON.stringify(rankData, null, 2),
                    }
                  }

                  return {
                    type: 'tool_result',
                    tool_use_id: toolUse.id,
                    content: 'Tool not found',
                  }
                })
              )

              // Continue conversation with tool results
              currentMessages = [
                ...currentMessages,
                {
                  role: 'assistant',
                  content: response.content,
                },
                {
                  role: 'user',
                  content: toolResults,
                },
              ]

              // Loop again to get final response
            } else {
              // No tool use, stream the final text response
              const textBlocks = response.content.filter(
                (block: any) => block.type === 'text'
              )

              for (const block of textBlocks) {
                if (block.type === 'text' && block.text) {
                  // Split into chunks for smoother streaming feel
                  const words = block.text.split(' ')
                  for (const word of words) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`)
                    )
                  }
                }
              }

              continueLoop = false
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Chat error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
