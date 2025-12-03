import { Block } from '@/types'

// Parse code blocks from Claude's response
export function parseBlocks(content: string): Block[] {
  const blocks: Block[] = []
  
  // Match both ``` and `` blocks (Claude sometimes uses 2 backticks)
  const blockRegex = /`{2,3}(\w+)\n([\s\S]*?)`{2,3}/g
  let match

  while ((match = blockRegex.exec(content)) !== null) {
    const blockType = match[1].toLowerCase()
    const blockContent = match[2].trim()

    try {
      const data = JSON.parse(blockContent)
      
      // Map block types
      switch (blockType) {
        case 'shop':
        case 'shopping':
          blocks.push({ type: 'shop', data })
          break
        case 'recipe':
          blocks.push({ type: 'recipe', data })
          break
        case 'outcome':
          blocks.push({ type: 'outcome', data })
          break
        case 'savings':
          blocks.push({ type: 'savings', data })
          break
        case 'cart':
          blocks.push({ type: 'cart', data })
          break
        case 'upsell':
          blocks.push({ type: 'upsell', data })
          break
        case 'comparison':
          blocks.push({ type: 'comparison', data })
          break
        case 'products':
          blocks.push({ type: 'products', data })
          break
        case 'suggestions':
          blocks.push({ type: 'suggestions', data })
          break
        case 'order':
          blocks.push({ type: 'order', data })
          break
        case 'bulkdeal':
        case 'bulk':
          blocks.push({ type: 'bulkdeal', data })
          break
        default:
          // Unknown block type, skip
          console.warn('Unknown block type:', blockType)
      }
    } catch (e) {
      // Failed to parse JSON, skip this block
      console.warn('Failed to parse block:', blockType, e)
    }
  }

  return blocks
}

// Extract text content without blocks
export function extractTextContent(content: string): string {
  return content
    // Remove complete blocks: ```type\n...```
    .replace(/`{2,3}\w+\n[\s\S]*?`{2,3}/g, '')
    // Remove incomplete blocks during streaming: ```type\n... (no closing backticks yet)
    .replace(/`{2,3}\w+\n[\s\S]*$/g, '')
    .trim()
}

// Check if content has blocks
export function hasBlocks(content: string): boolean {
  return /`{2,3}\w+\n[\s\S]*?`{2,3}/.test(content)
}
