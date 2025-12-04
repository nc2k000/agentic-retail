import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

/**
 * Recipe Fetch API
 *
 * Fetches recipe content from URLs (AllRecipes, Food Network, Instagram, TikTok, etc.)
 * Extracts text content and returns it for Claude to parse
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AgenticRetail/1.0; +https://agentic-retail.vercel.app)',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch recipe: ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()

    // Parse HTML and extract recipe content
    const $ = cheerio.load(html)

    // Remove script, style, nav, footer, and other non-content elements
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .social-share').remove()

    // Try to find recipe-specific content
    let recipeContent = ''

    // Strategy 1: Look for recipe schema/structured data
    const recipeSchema = $('script[type="application/ld+json"]').filter((_, el) => {
      const content = $(el).html()
      return content?.includes('"@type":"Recipe"') || content?.includes('"@type": "Recipe"')
    }).first()

    if (recipeSchema.length) {
      try {
        const schemaData = JSON.parse(recipeSchema.html() || '{}')
        if (schemaData.recipeIngredient || schemaData.ingredients) {
          recipeContent = `Recipe: ${schemaData.name || 'Untitled'}\n\n`
          recipeContent += 'Ingredients:\n'
          const ingredients = schemaData.recipeIngredient || schemaData.ingredients || []
          ingredients.forEach((ing: string) => {
            recipeContent += `- ${ing}\n`
          })
          if (schemaData.recipeInstructions) {
            recipeContent += '\nInstructions:\n'
            const instructions = Array.isArray(schemaData.recipeInstructions)
              ? schemaData.recipeInstructions
              : [schemaData.recipeInstructions]
            instructions.forEach((step: any, idx: number) => {
              const text = typeof step === 'string' ? step : step.text
              recipeContent += `${idx + 1}. ${text}\n`
            })
          }
        }
      } catch (e) {
        console.error('Error parsing recipe schema:', e)
      }
    }

    // Strategy 2: Look for common recipe selectors
    if (!recipeContent) {
      const recipeSelectors = [
        '.recipe-content',
        '.recipe',
        '[class*="recipe"]',
        '[class*="ingredients"]',
        '.ingredients',
        'article',
        'main',
      ]

      for (const selector of recipeSelectors) {
        const element = $(selector).first()
        if (element.length && element.text().trim().length > 100) {
          recipeContent = element.text()
          break
        }
      }
    }

    // Strategy 3: Get body text as fallback
    if (!recipeContent) {
      recipeContent = $('body').text()
    }

    // Clean up the text
    recipeContent = recipeContent
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\n\s*\n/g, '\n') // Remove extra newlines
      .trim()

    // Limit content length (Claude has token limits)
    const maxLength = 8000
    if (recipeContent.length > maxLength) {
      recipeContent = recipeContent.substring(0, maxLength) + '...'
    }

    // Extract site info
    const siteName = parsedUrl.hostname.replace('www.', '')

    return NextResponse.json({
      success: true,
      url,
      siteName,
      content: recipeContent,
      contentLength: recipeContent.length,
    })

  } catch (error) {
    console.error('Recipe fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe content' },
      { status: 500 }
    )
  }
}
