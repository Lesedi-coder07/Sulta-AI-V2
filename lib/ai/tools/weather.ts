import { tool } from 'ai';
import { z } from 'zod';

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface OpenMeteoCurrentUnits {
  temperature_2m: string;
  apparent_temperature: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
  weathercode: string;
}

interface OpenMeteoCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weathercode: number;
}

interface OpenMeteoResponse {
  current_units: OpenMeteoCurrentUnits;
  current: OpenMeteoCurrent;
}

export const weatherTool = tool({
  description:
    'Gets the current weather for a city or location. ' +
    'Returns temperature (°C and °F), conditions, humidity, wind speed, and "feels like" temperature. ' +
    'Uses the free Open-Meteo API — no API key required.',
  inputSchema: z.object({
    location: z
      .string()
      .describe('City name or location to get weather for, e.g. "London", "New York", "Tokyo"'),
  }),
  execute: async ({ location }: { location: string }) => {
    try {
      // Step 1: Geocode the location
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(8000) });

      if (!geoRes.ok) return { error: 'Geocoding service unavailable.' };

      const geoData = await geoRes.json();
      const place: GeoResult | undefined = geoData?.results?.[0];

      if (!place) {
        return { error: `Could not find a location matching "${location}".` };
      }

      const { latitude, longitude, name, country, admin1 } = place;
      const displayName = admin1 ? `${name}, ${admin1}, ${country}` : `${name}, ${country}`;

      // Step 2: Fetch current weather from Open-Meteo
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode` +
        `&wind_speed_unit=mph` +
        `&timezone=auto`;

      const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(8000) });

      if (!weatherRes.ok) return { error: 'Weather service unavailable.' };

      const weatherData: OpenMeteoResponse = await weatherRes.json();
      const c = weatherData.current;
      const u = weatherData.current_units;

      const tempC = c.temperature_2m;
      const tempF = parseFloat(((tempC * 9) / 5 + 32).toFixed(1));
      const feelsC = c.apparent_temperature;
      const feelsF = parseFloat(((feelsC * 9) / 5 + 32).toFixed(1));
      const condition = WMO_CODES[c.weathercode] ?? 'Unknown';

      return {
        location: displayName,
        condition,
        temperature: { celsius: tempC, fahrenheit: tempF, unit: u.temperature_2m },
        feelsLike: { celsius: feelsC, fahrenheit: feelsF },
        humidity: `${c.relative_humidity_2m}%`,
        windSpeed: `${c.wind_speed_10m} ${u.wind_speed_10m}`,
      };
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        return { error: 'Weather request timed out. Please try again.' };
      }
      return { error: err instanceof Error ? err.message : 'Failed to fetch weather.' };
    }
  },
});
