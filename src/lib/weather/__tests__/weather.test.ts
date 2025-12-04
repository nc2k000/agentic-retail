import { generateWeatherContext, getWeatherPromptContext } from '../index'
import type { WeatherData } from '../index'

describe('Weather Service', () => {
  describe('generateWeatherContext', () => {
    it('should generate cold weather suggestions', () => {
      const coldWeather: WeatherData = {
        temp: 25,
        feelsLike: 20,
        condition: 'Snow',
        description: 'light snow',
        humidity: 80,
        location: 'Portland',
        season: 'winter',
      }

      const context = generateWeatherContext(coldWeather)

      expect(context.summary).toContain('25°F')
      expect(context.summary).toContain('light snow')
      expect(context.summary).toContain('winter')
      expect(context.suggestions).toContain('hot soups, stews, and comfort foods')
      expect(context.suggestions).toContain('warming comfort foods and hot beverages')
    })

    it('should generate hot weather suggestions', () => {
      const hotWeather: WeatherData = {
        temp: 95,
        feelsLike: 100,
        condition: 'Clear',
        description: 'clear sky',
        humidity: 40,
        location: 'Phoenix',
        season: 'summer',
      }

      const context = generateWeatherContext(hotWeather)

      expect(context.summary).toContain('95°F')
      expect(context.summary).toContain('clear sky')
      expect(context.summary).toContain('summer')
      expect(context.suggestions).toContain('refreshing salads, cold drinks, and light snacks')
      expect(context.suggestions).toContain('outdoor entertaining and BBQ supplies')
    })

    it('should generate rainy weather suggestions', () => {
      const rainyWeather: WeatherData = {
        temp: 60,
        feelsLike: 58,
        condition: 'Rain',
        description: 'moderate rain',
        humidity: 90,
        location: 'Seattle',
        season: 'spring',
      }

      const context = generateWeatherContext(rainyWeather)

      expect(context.summary).toContain('60°F')
      expect(context.summary).toContain('moderate rain')
      expect(context.suggestions).toContain('comfort foods and indoor meal ideas')
    })

    it('should generate seasonal suggestions', () => {
      const fallWeather: WeatherData = {
        temp: 55,
        feelsLike: 52,
        condition: 'Clouds',
        description: 'partly cloudy',
        humidity: 65,
        location: 'Boston',
        season: 'fall',
      }

      const context = generateWeatherContext(fallWeather)

      expect(context.suggestions).toContain('pumpkin spice items and fall flavors')
    })

    it('should remove duplicate suggestions', () => {
      const weather: WeatherData = {
        temp: 30,
        feelsLike: 25,
        condition: 'Snow',
        description: 'heavy snow',
        humidity: 85,
        location: 'Denver',
        season: 'winter',
      }

      const context = generateWeatherContext(weather)

      // Check that all suggestions are unique
      const uniqueSuggestions = Array.from(new Set(context.suggestions))
      expect(context.suggestions.length).toBe(uniqueSuggestions.length)
    })
  })

  describe('getWeatherPromptContext', () => {
    it('should format weather context for AI prompt', () => {
      const weather: WeatherData = {
        temp: 72,
        feelsLike: 74,
        condition: 'Clear',
        description: 'clear sky',
        humidity: 50,
        location: 'San Francisco',
        season: 'spring',
      }

      const promptContext = getWeatherPromptContext(weather)

      expect(promptContext).toContain('## Current Weather Context')
      expect(promptContext).toContain('Location: San Francisco')
      expect(promptContext).toContain('Temperature: 72°F')
      expect(promptContext).toContain('feels like 74°F')
      expect(promptContext).toContain('Conditions: clear sky')
      expect(promptContext).toContain('Season: spring')
      expect(promptContext).toContain('**Contextual Suggestions:**')
    })

    it('should include guidance for AI usage', () => {
      const weather: WeatherData = {
        temp: 65,
        feelsLike: 63,
        condition: 'Clouds',
        description: 'overcast',
        humidity: 70,
        location: 'London',
        season: 'fall',
      }

      const promptContext = getWeatherPromptContext(weather)

      expect(promptContext).toContain('Use this weather context to make relevant product suggestions')
      expect(promptContext).toContain("don't force it into every response")
    })
  })
})
