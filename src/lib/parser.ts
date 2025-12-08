import { Block } from '@/types'
import { getAllProducts } from '@/lib/catalog'

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
        case 'compare':
          blocks.push({ type: 'compare', data })
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
        case 'carousel':
          // Enrich carousel blocks: convert SKUs to full product objects
          const enrichedData = enrichCarouselBlock(data)
          blocks.push({ type: 'carousel', data: enrichedData })
          break
        case 'tree':
          blocks.push({ type: 'tree', data })
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

// Enrich carousel block data by converting SKUs to full product objects
function enrichCarouselBlock(data: any): any {
  // If data has SKUs but no items, enrich them
  if (data.skus && Array.isArray(data.skus) && (!data.items || data.items.length === 0)) {
    console.log('🔄 Enriching carousel block with SKUs:', data.skus)

    const catalog = getAllProducts()
    const skuSet = new Set(data.skus)

    // Find all products matching the SKUs, preserving the original order
    const enrichedItems = data.skus
      .map((sku: string) => catalog.find(p => p.sku === sku))
      .filter(Boolean) // Remove any undefined (SKUs not found in catalog)
      .map((product: any, index: number) => ({
        ...product,
        rank: index + 1,
        score: 1.0 - (index * 0.1), // Descending scores
      }))

    console.log(`   ✅ Enriched ${enrichedItems.length} products from ${data.skus.length} SKUs`)

    return {
      ...data,
      items: enrichedItems,
    }
  }

  // Data already has items, return as-is
  return data
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
