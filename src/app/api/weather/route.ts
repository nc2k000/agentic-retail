import { NextRequest, NextResponse } from 'next/server'
import { fetchWeather } from '@/lib/weather'

/**
 * Weather API Route
 *
 * Fetches weather data from OpenWeatherMap based on lat/lon coordinates.
 * This is a server-side proxy to keep the API key secure.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing lat or lon parameters' },
      { status: 400 }
    )
  }

  try {
    const weatherData = await fetchWeather(parseFloat(lat), parseFloat(lon))

    if (!weatherData) {
      return NextResponse.json(
        { error: 'Weather data not available' },
        { status: 503 }
      )
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
