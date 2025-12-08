import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { discoverFromMessage } from '@/lib/household/discovery'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Tool definitions
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
  {
    name: 'get_restock_suggestions',
    description: 'Get food/grocery/consumable items the user needs to restock. STRICTLY ONLY use for food, beverages, and everyday consumables (toilet paper, paper towels, cleaning supplies). NEVER CALL THIS TOOL when user is asking about: TVs, electronics, appliances (washers/dryers/fridges/dishwashers), furniture, mattresses, phones, laptops, computers, tablets, or any durable/high-consideration purchases. Only use when user explicitly asks about groceries or food restocking.',
    input_schema: {
      type: 'object' as const,
      properties: {
        urgentOnly: {
          type: 'boolean' as const,
          description: 'If true, only return items that need ordering now or soon. Default: true',
        },
      },
      required: [] as string[],
    },
  },
]

// Helper to detect decision tree queries
function detectTreeQuery(text: string): { treeId: string; treeName: string } | null {
  const lower = text.toLowerCase()

  // TVs - Electronics
  if (lower.includes('tv') || lower.includes('television')) {
    return { treeId: 'tv-purchase', treeName: 'Find Your Perfect TV' }
  }

  // Coffee Machines - Small Appliances
  if (lower.includes('coffee machine') || lower.includes('coffee maker') || lower.includes('espresso machine') ||
      lower.includes('coffee') && (lower.includes('machine') || lower.includes('maker') || lower.includes('buy') || lower.includes('need'))) {
    return { treeId: 'coffee-machine-purchase', treeName: 'Find Your Perfect Coffee Machine' }
  }

  // Paint - Home Improvement
  if (lower.includes('paint') && !lower.includes('painting') || lower.includes('stain') && (lower.includes('wood') || lower.includes('deck'))) {
    return { treeId: 'paint-purchase', treeName: 'Find Your Perfect Paint' }
  }

  // Mattresses - Furniture/Bedding
  if (lower.includes('mattress') || lower.includes('bed') && (lower.includes('new') || lower.includes('buy') || lower.includes('need'))) {
    return { treeId: 'mattress-purchase', treeName: 'Find Your Perfect Mattress' }
  }

  // Power Tools - Tools & Hardware
  if (lower.includes('drill') || lower.includes('saw') || lower.includes('sander') ||
      lower.includes('power tool') || lower.includes('impact driver')) {
    return { treeId: 'power-tool-purchase', treeName: 'Find Your Perfect Power Tool' }
  }

  // Large Appliances - Future expansion
  if (lower.includes('washer') || lower.includes('dryer') || lower.includes('dishwasher') ||
      lower.includes('refrigerator') || lower.includes('fridge') || lower.includes('appliance')) {
    return { treeId: 'appliance-purchase', treeName: 'Find Your Perfect Appliance' }
  }

  // Furniture - Future expansion
  if (lower.includes('couch') || lower.includes('sofa') ||
      lower.includes('desk') || lower.includes('table') || lower.includes('furniture')) {
    return { treeId: 'furniture-purchase', treeName: 'Find Your Perfect Furniture' }
  }

  return null
}

export async function POST(request: NextRequest) {
  console.log('═══════════════════════════════════════════════════════')
  console.log('🎯 CHAT API ROUTE ENTRY')
  console.log('═══════════════════════════════════════════════════════')

  try {
    const { messages, system } = await request.json()

    console.log('📥 Step 1: Request parsed')
    console.log('   Messages count:', messages.length)
    console.log('   System prompt length:', system?.length || 0)

    // The messages array can contain either text strings or content blocks (for multimodal)
    // Claude API handles both formats automatically, so no transformation needed

    console.log('🚀 Step 2: Validating messages')
    console.log('   Messages:', JSON.stringify(messages, null, 2))
    console.log('🔧 Tools available:', tools.length, 'tools')

    // Progressive Discovery & Decision Tree Interception
    // Extract the last user message
    const lastMessage = messages[messages.length - 1]
    console.log('📨 Step 3: Last message extracted')
    console.log('   Role:', lastMessage?.role)
    console.log('   Content type:', typeof lastMessage?.content)

    // INTERCEPT: Detect decision tree queries and inject tree response directly
    if (lastMessage && lastMessage.role === 'user') {
      console.log('👤 Step 4: User message confirmed, extracting text')

      let messageText = ''
      if (typeof lastMessage.content === 'string') {
        messageText = lastMessage.content
        console.log('   ✓ Content is string:', messageText)
      } else if (Array.isArray(lastMessage.content)) {
        const textBlocks = lastMessage.content.filter((b: any) => b.type === 'text')
        messageText = textBlocks.map((b: any) => b.text).join(' ')
        console.log('   ✓ Content is array, extracted text:', messageText)
      }

      console.log('🔍 Step 5: Checking for tree query')
      console.log('   Message text:', messageText.slice(0, 100))
      console.log('   Lowercase:', messageText.toLowerCase().slice(0, 100))

      const treeMatch = detectTreeQuery(messageText)
      console.log('🌲 Step 6: Tree detection result:', treeMatch)

      // Check if there's already a completed tree mission in the system prompt
      const hasCompletedTreeMission = system && system.includes('CRITICAL: PREVIOUS DECISION TREE DETECTED') && system.includes('**Completed:** YES')
      console.log('📋 Step 6.5: Checking for existing mission')
      console.log('   Has completed tree mission:', hasCompletedTreeMission)
      if (system && system.includes('CRITICAL: PREVIOUS DECISION TREE DETECTED')) {
        console.log('   ✓ Found tree resumption context in system prompt')
      }

      if (treeMatch && !hasCompletedTreeMission) {
        console.log('✅ TREE MATCH FOUND! Intercepting request (no existing mission)')
        console.log('   Tree ID:', treeMatch.treeId)
        console.log('   Tree Name:', treeMatch.treeName)

        // Return a pre-built streaming response with the tree
        const treeResponse = `I'll help you find the perfect ${treeMatch.treeId.replace('-purchase', '')}. Let me ask you a few questions:\n\n\`\`\`tree\n${JSON.stringify({
          treeId: treeMatch.treeId,
          treeName: treeMatch.treeName,
          description: `Let's find the right ${treeMatch.treeId.replace('-purchase', '')} for your needs`,
          estimatedTime: '1 minute'
        })}\n\`\`\``

        console.log('📤 Step 7: Building tree response')
        console.log('   Response:', treeResponse)

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            console.log('🌊 Step 8: Streaming tree response in SSE format')

            // Stream the response word by word in SSE format (matching Claude's streaming)
            const words = treeResponse.split(' ')
            for (const word of words) {
              const chunk = `data: ${JSON.stringify({ text: word + ' ' })}\n\n`
              controller.enqueue(encoder.encode(chunk))
            }

            // Send the DONE signal
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            console.log('✓ Stream closed, sent', words.length, 'words')
          }
        })

        console.log('🎉 RETURNING TREE RESPONSE - BYPASSING CLAUDE')
        console.log('═══════════════════════════════════════════════════════')
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        })
      } else if (treeMatch && hasCompletedTreeMission) {
        console.log('⏭️  Tree match found BUT completed mission exists - letting Claude handle resumption')
      } else {
        console.log('❌ No tree match found, continuing to Claude API')
      }
    }

    // Progressive Discovery: Learn from user messages (async, non-blocking)
    if (lastMessage && lastMessage.role === 'user') {
      // Get the text content from the message
      let messageText = ''
      if (typeof lastMessage.content === 'string') {
        messageText = lastMessage.content
      } else if (Array.isArray(lastMessage.content)) {
        // Handle content blocks (multimodal)
        const textBlocks = lastMessage.content.filter((b: any) => b.type === 'text')
        messageText = textBlocks.map((b: any) => b.text).join(' ')
      }

      if (messageText.length > 0) {
        // Discover facts asynchronously (fire-and-forget)
        // Don't wait for this to complete - it runs in the background
        fetch(`${request.nextUrl.origin}/api/household/discover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            type: 'message',
            data: {
              message: messageText,
              timestamp: new Date().toISOString(),
            },
          }),
        }).catch(err => {
          // Silently log error, don't block chat response
          console.error('⚠️ Background discovery error:', err.message)
        })
      }
    }

    const encoder = new TextEncoder()

    // Create a ReadableStream for the response
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let currentMessages = messages
          let continueLoop = true

          while (continueLoop) {
            // Filter out restock tool for tree contexts
            const hasTreeResumption = system && system.includes('CRITICAL: PREVIOUS DECISION TREE DETECTED')

            // Also check if user message contains tree keywords
            const lastMsg = currentMessages[currentMessages.length - 1]
            let hasTreeKeywords = false
            if (lastMsg && lastMsg.role === 'user') {
              const msgText = typeof lastMsg.content === 'string' ? lastMsg.content :
                Array.isArray(lastMsg.content) ? lastMsg.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join(' ') : ''
              const lower = msgText.toLowerCase()
              const treeKeywords = ['tv', 'television', 'coffee machine', 'coffee maker', 'espresso', 'paint', 'stain', 'primer',
                'mattress', 'bed', 'drill', 'saw', 'sander', 'power tool', 'appliance', 'washer', 'dryer', 'fridge', 'dishwasher']
              hasTreeKeywords = treeKeywords.some(kw => lower.includes(kw))
            }

            const shouldBlockRestock = hasTreeResumption || hasTreeKeywords
            const filteredTools = shouldBlockRestock
              ? tools.filter(t => t.name !== 'get_restock_suggestions')
              : tools

            if (shouldBlockRestock) {
              console.log('🚫 Blocking get_restock_suggestions -', hasTreeResumption ? 'Tree resumption' : 'Tree keywords detected')
            }

            // Call Claude with tools
            console.log('📞 Calling Claude API with tools:', filteredTools.map(t => t.name).join(', '))

            const response = await anthropic.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 4096,
              system: system,
              messages: currentMessages,
              tools: filteredTools,
            })

            console.log('📨 Claude response content blocks:', response.content.map((b: any) => b.type).join(', '))

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

                    // 🚨 HARD BLOCK: If system prompt has cached products, return those instead of searching
                    const hasCachedProducts = system && system.includes('**Saved Product SKUs:**')
                    if (hasCachedProducts) {
                      console.log('🛑 BLOCKING rank_products - Cached products exist in system prompt')

                      // Extract the cached SKUs from the system prompt
                      const skuMatch = system.match(/\*\*Saved Product SKUs:\*\* (.+?)(?:\n|$)/)
                      const cachedSkus = skuMatch ? JSON.parse(`[${skuMatch[1]}]`) : []

                      console.log(`   Returning ${cachedSkus.length} cached products:`, cachedSkus.join(', '))

                      return {
                        type: 'tool_result',
                        tool_use_id: toolUse.id,
                        content: JSON.stringify({
                          products: [],
                          message: 'CACHED_PRODUCTS_EXIST',
                          cachedSkus: cachedSkus,
                          instruction: 'You have cached products in your system prompt. Return them in a carousel block instead of calling rank_products.'
                        }, null, 2),
                      }
                    }

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

                    // NOTE: Don't save products from rank_products!
                    // Claude may call rank_products multiple times or filter results.
                    // We'll save products from the final carousel block instead.

                    return {
                      type: 'tool_result',
                      tool_use_id: toolUse.id,
                      content: JSON.stringify(rankData, null, 2),
                    }
                  }

                  if (toolUse.name === 'get_restock_suggestions') {
                    // CRITICAL GUARDRAIL: Check if user is asking about non-food items
                    // Extract text from recent messages (handle both string and array content)
                    const recentTexts: string[] = []
                    messages.slice(-5).forEach((m: any) => {
                      if (typeof m.content === 'string') {
                        recentTexts.push(m.content.toLowerCase())
                      } else if (Array.isArray(m.content)) {
                        m.content.forEach((block: any) => {
                          if (block.type === 'text' && block.text) {
                            recentTexts.push(block.text.toLowerCase())
                          }
                        })
                      }
                    })
                    const conversationContext = recentTexts.join(' ')

                    const highConsiderationKeywords = ['tv', 'television', 'appliance', 'furniture', 'couch', 'sofa', 'bed', 'laptop', 'computer', 'phone', 'tablet', 'washer', 'dryer', 'fridge', 'refrigerator', 'dishwasher', 'mattress', 'electronics', 'coffee machine', 'coffee maker', 'espresso', 'paint', 'stain', 'primer', 'drill', 'saw', 'sander', 'power tool', 'power tools']
                    const isHighConsideration = highConsiderationKeywords.some(keyword => conversationContext.includes(keyword))

                    if (isHighConsideration) {
                      console.log('🚫 BLOCKED get_restock_suggestions - High-consideration query detected:', conversationContext.slice(0, 200))
                      return {
                        type: 'tool_result',
                        tool_use_id: toolUse.id,
                        content: JSON.stringify({ items: [], message: 'Restock suggestions not applicable for this query type' }),
                      }
                    }

                    const { urgentOnly = true } = toolUse.input
                    console.log('🔄 Calling get_restock_suggestions:', { urgentOnly })

                    // Call the restock API
                    const restockResponse = await fetch(
                      `${request.nextUrl.origin}/api/restock?urgentOnly=${urgentOnly}`,
                      {
                        method: 'GET',
                        headers: {
                          'Cookie': request.headers.get('cookie') || '',
                        },
                      }
                    )

                    const restockData = await restockResponse.json()

                    return {
                      type: 'tool_result',
                      tool_use_id: toolUse.id,
                      content: JSON.stringify(restockData, null, 2),
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
