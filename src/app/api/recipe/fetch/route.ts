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

    // Check if this is a social media site (requires different handling)
    const hostname = parsedUrl.hostname.toLowerCase()
    const isSocialMedia = hostname.includes('instagram.com') ||
                          hostname.includes('tiktok.com') ||
                          hostname.includes('facebook.com') ||
                          hostname.includes('twitter.com') ||
                          hostname.includes('x.com')

    if (isSocialMedia) {
      return NextResponse.json({
        error: 'Social media sites require JavaScript rendering. Please use the Image or Text tab to import the recipe instead.',
        suggestion: 'screenshot',
      }, { status: 400 })
    }

    // Remove script, style, nav, footer, and other non-content elements
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .social-share').remove()

    // Try to find recipe-specific content
    let recipeContent = ''

    // Strategy 1: Look for recipe schema/structured data
    const recipeSchema = $('script[type="application/ld+json"]').filter((_, el) => {
      const content = $(el).html()
      return !!(content?.includes('"@type":"Recipe"') || content?.includes('"@type": "Recipe"'))
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

    // Strategy 2: Look for meta tags (og:description, description)
    if (!recipeContent) {
      const metaDescription = $('meta[property="og:description"]').attr('content') ||
                             $('meta[name="description"]').attr('content') ||
                             ''
      if (metaDescription.length > 100) {
        const title = $('meta[property="og:title"]').attr('content') ||
                     $('title').text() ||
                     'Recipe'
        recipeContent = `${title}\n\n${metaDescription}`
      }
    }

    // Strategy 3: Look for common recipe selectors (expanded list)
    if (!recipeContent) {
      const recipeSelectors = [
        // Recipe-specific selectors
        '.recipe-content',
        '.recipe-details',
        '.recipe-body',
        '.recipe-container',
        '[class*="recipe-content"]',
        '[class*="recipe__content"]',

        // Ingredient selectors
        '.ingredients-section',
        '.ingredient-list',
        '[class*="ingredients"]',
        '.ingredients',

        // Instruction selectors
        '.instructions',
        '.directions',
        '.recipe-steps',
        '[class*="instructions"]',

        // Generic content selectors
        'article[class*="recipe"]',
        'div[class*="recipe"]',
        'section[class*="recipe"]',
        'article',
        'main',
        '.entry-content',
        '.post-content',
      ]

      for (const selector of recipeSelectors) {
        const element = $(selector).first()
        const text = element.text().trim()
        if (element.length && text.length > 200) {
          recipeContent = text
          break
        }
      }
    }

    // Strategy 4: Try to find ingredients + instructions sections separately
    if (!recipeContent) {
      const ingredientsEl = $('.ingredients, [class*="ingredient"]').first()
      const instructionsEl = $('.instructions, .directions, [class*="instructions"], [class*="directions"]').first()

      if (ingredientsEl.length || instructionsEl.length) {
        const title = $('h1').first().text() || $('title').text() || 'Recipe'
        recipeContent = `${title}\n\n`

        if (ingredientsEl.length) {
          recipeContent += 'Ingredients:\n' + ingredientsEl.text().trim() + '\n\n'
        }

        if (instructionsEl.length) {
          recipeContent += 'Instructions:\n' + instructionsEl.text().trim()
        }
      }
    }

    // Strategy 5: Get body text as fallback
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
