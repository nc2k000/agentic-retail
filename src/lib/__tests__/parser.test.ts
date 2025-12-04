import { parseBlocks, extractTextContent, hasBlocks } from '../parser'

describe('Parser', () => {
  describe('parseBlocks', () => {
    it('should parse shop block with 3 backticks', () => {
      const content = '```shop\n{"title":"Groceries","items":[{"sku":"1","name":"Milk"}]}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('shop')
      expect(blocks[0].data.title).toBe('Groceries')
      expect(blocks[0].data.items).toHaveLength(1)
    })

    it('should parse shop block with 2 backticks', () => {
      const content = '``shop\n{"title":"Groceries","items":[{"sku":"1","name":"Milk"}]}\n``'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('shop')
    })

    it('should parse shopping block as shop type', () => {
      const content = '```shopping\n{"title":"List","items":[]}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('shop')
    })

    it('should parse recipe block', () => {
      const content = '```recipe\n{"name":"Pasta","ingredients":["pasta","sauce"]}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('recipe')
      expect(blocks[0].data.name).toBe('Pasta')
    })

    it('should parse savings block', () => {
      const content = '```savings\n{"original":"SKU1","replacement":"SKU2","savings":2.50}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('savings')
      expect(blocks[0].data.savings).toBe(2.50)
    })

    it('should parse compare block with both names', () => {
      const content = '```compare\n{"items":[{"name":"TV1"},{"name":"TV2"}]}\n```'
      const comparison = parseBlocks(content)

      expect(comparison).toHaveLength(1)
      expect(comparison[0].type).toBe('compare')

      const content2 = '```comparison\n{"items":[{"name":"TV1"}]}\n```'
      const comparison2 = parseBlocks(content2)

      expect(comparison2).toHaveLength(1)
      expect(comparison2[0].type).toBe('compare')
    })

    it('should parse bulkdeal block with both names', () => {
      const content = '```bulkdeal\n{"sku":"123","deal":"Buy 2 get 1 free"}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('bulkdeal')

      const content2 = '```bulk\n{"sku":"123","deal":"Discount"}\n```'
      const blocks2 = parseBlocks(content2)

      expect(blocks2).toHaveLength(1)
      expect(blocks2[0].type).toBe('bulkdeal')
    })

    it('should parse upsell block', () => {
      const content = '```upsell\n{"items":[{"sku":"1","name":"Batteries"}]}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('upsell')
    })

    it('should parse order block', () => {
      const content = '```order\n{"id":"12345","total":99.99}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('order')
      expect(blocks[0].data.total).toBe(99.99)
    })

    it('should parse suggestions block', () => {
      const content = '```suggestions\n{"chips":["Add to cart","View details"]}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('suggestions')
    })

    it('should parse multiple blocks in one message', () => {
      const content = 'Here are your groceries:\n' +
        '```shop\n' +
        '{"title":"Groceries","items":[{"sku":"1","name":"Milk"}]}\n' +
        '```\n\n' +
        'And here are some suggestions:\n' +
        '```suggestions\n' +
        '{"chips":["Add more","Checkout"]}\n' +
        '```\n'

      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(2)
      expect(blocks[0].type).toBe('shop')
      expect(blocks[1].type).toBe('suggestions')
    })

    it('should handle invalid JSON gracefully', () => {
      const content = '```shop\n{invalid json}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(0) // Should skip invalid blocks
    })

    it('should ignore unknown block types', () => {
      const content = '```unknown\n{"data":"test"}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(0)
    })

    it('should handle empty content', () => {
      const blocks = parseBlocks('')
      expect(blocks).toHaveLength(0)
    })

    it('should be case insensitive for block types', () => {
      const content = '```SHOP\n{"title":"List","items":[]}\n```'
      const blocks = parseBlocks(content)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('shop')
    })
  })

  describe('extractTextContent', () => {
    it('should remove code blocks and return text', () => {
      const content = 'Here is your list:\n```shop\n{"items":[]}\n```\nEnjoy!'
      const text = extractTextContent(content)

      expect(text).toBe('Here is your list:\n\nEnjoy!')
    })

    it('should remove multiple blocks', () => {
      const content = 'Text 1\n```shop\n{}\n```\nText 2\n```savings\n{}\n```\nText 3'
      const text = extractTextContent(content)

      expect(text).toBe('Text 1\n\nText 2\n\nText 3')
    })

    it('should handle incomplete streaming blocks', () => {
      const content = 'Here is a partial:\n```shop\n{"items":[{"sku"'
      const text = extractTextContent(content)

      expect(text).toBe('Here is a partial:')
    })

    it('should return original text if no blocks', () => {
      const content = 'Just some regular text without any blocks'
      const text = extractTextContent(content)

      expect(text).toBe(content)
    })

    it('should handle empty content', () => {
      const text = extractTextContent('')
      expect(text).toBe('')
    })

    it('should handle 2-backtick blocks', () => {
      const content = 'Text\n``shop\n{}\n``\nMore'
      const text = extractTextContent(content)

      expect(text).toBe('Text\n\nMore')
    })
  })

  describe('hasBlocks', () => {
    it('should return true for content with 3-backtick blocks', () => {
      expect(hasBlocks('```shop\n{}\n```')).toBe(true)
    })

    it('should return true for content with 2-backtick blocks', () => {
      expect(hasBlocks('``shop\n{}\n``')).toBe(true)
    })

    it('should return true when blocks are within text', () => {
      expect(hasBlocks('Some text\n```shop\n{}\n```\nMore text')).toBe(true)
    })

    it('should return false for plain text', () => {
      expect(hasBlocks('Just plain text')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(hasBlocks('')).toBe(false)
    })

    it('should return false for incomplete block markers', () => {
      expect(hasBlocks('```')).toBe(false)
      expect(hasBlocks('```shop')).toBe(false)
    })

    it('should return false for text with backticks but no block structure', () => {
      expect(hasBlocks('Use `code` for inline')).toBe(false)
    })
  })
})
