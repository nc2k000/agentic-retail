/**
 * Weather Service
 *
 * Fetches current weather conditions to provide context for AI recommendations.
 * Uses OpenWeatherMap API (free tier: 1000 calls/day)
 */

export interface WeatherData {
  temp: number // Fahrenheit
  feelsLike: number
  condition: string // "Clear", "Rain", "Snow", etc.
  description: string // "light rain", "clear sky", etc.
  humidity: number
  location: string
  season: 'winter' | 'spring' | 'summer' | 'fall'
}

export interface WeatherContext {
  summary: string // Human-readable summary for AI prompt
  suggestions: string[] // Contextual suggestions
}

/**
 * Get current season based on month
 */
function getCurrentSeason(): 'winter' | 'spring' | 'summer' | 'fall' {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

/**
 * Fetch weather data from OpenWeatherMap API
 */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    console.warn('OPENWEATHER_API_KEY not set - weather features disabled')
    return null
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const response = await fetch(url, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    })

    if (!response.ok) {
      console.error('Weather API error:', response.status)
      return null
    }

    const data = await response.json()

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      location: data.name,
      season: getCurrentSeason(),
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

/**
 * Fetch weather by zip code (US only)
 */
export async function fetchWeatherByZip(zipCode: string): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    console.warn('OPENWEATHER_API_KEY not set - weather features disabled')
    return null
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},US&appid=${apiKey}&units=imperial`
    const response = await fetch(url, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    })

    if (!response.ok) {
      console.error('Weather API error:', response.status)
      return null
    }

    const data = await response.json()

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      location: data.name,
      season: getCurrentSeason(),
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

/**
 * Generate weather context for AI prompt injection
 */
export function generateWeatherContext(weather: WeatherData): WeatherContext {
  const { temp, condition, description, season, location } = weather

  // Build contextual suggestions
  const suggestions: string[] = []

  // Temperature-based suggestions
  if (temp < 32) {
    suggestions.push('hot soups, stews, and comfort foods')
    suggestions.push('hot chocolate, coffee, and tea')
  } else if (temp < 50) {
    suggestions.push('warm meals like casseroles and roasted dishes')
    suggestions.push('chili, soup, and hearty sides')
  } else if (temp < 70) {
    suggestions.push('versatile ingredients for indoor and outdoor cooking')
  } else if (temp < 85) {
    suggestions.push('salads, grilled items, and light meals')
    suggestions.push('cold beverages and fresh produce')
  } else {
    suggestions.push('refreshing salads, cold drinks, and light snacks')
    suggestions.push('BBQ items and outdoor entertaining supplies')
  }

  // Condition-based suggestions
  if (condition === 'Rain' || condition === 'Drizzle') {
    suggestions.push('comfort foods and indoor meal ideas')
  } else if (condition === 'Snow') {
    suggestions.push('warming comfort foods and hot beverages')
  } else if (condition === 'Clear' && temp > 70) {
    suggestions.push('outdoor entertaining and BBQ supplies')
  }

  // Season-based suggestions
  if (season === 'winter') {
    suggestions.push('holiday baking ingredients')
  } else if (season === 'summer') {
    suggestions.push('picnic and party supplies')
  } else if (season === 'fall') {
    suggestions.push('pumpkin spice items and fall flavors')
  } else if (season === 'spring') {
    suggestions.push('fresh seasonal produce')
  }

  // Generate summary
  const summary = `Current weather in ${location}: ${temp}°F, ${description}. It's ${season}.`

  return {
    summary,
    suggestions: [...new Set(suggestions)], // Remove duplicates
  }
}

/**
 * Get weather context string for AI prompt injection
 */
export function getWeatherPromptContext(weather: WeatherData): string {
  const context = generateWeatherContext(weather)

  return `## Current Weather Context
Location: ${weather.location}
Temperature: ${weather.temp}°F (feels like ${weather.feelsLike}°F)
Conditions: ${weather.description}
Season: ${weather.season}

**Contextual Suggestions:** Consider suggesting ${context.suggestions.join(', ')} based on the current weather and season.

Use this weather context to make relevant product suggestions, but don't force it into every response. Only mention weather when it naturally enhances your recommendations.
`
}
