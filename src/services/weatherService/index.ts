/**
 * WeatherAPI.com — current conditions and 7-day forecast for check-in context.
 */

const BASE_URL = "https://api.weatherapi.com/v1";

export interface WeatherSnapshot {
  temp_c: number;
  humidity: number;
  condition: string;
  location: string;
  forecast: Array<{
    date: string;
    daily_chance_of_rain: number;
    maxtemp_c: number;
    mintemp_c: number;
    condition: string;
  }>;
}

interface WeatherApiCurrentResponse {
  location: { name: string };
  current: {
    temp_c: number;
    humidity: number;
    condition: { text: string };
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        daily_chance_of_rain: number;
        maxtemp_c: number;
        mintemp_c: number;
        condition: { text: string };
      };
    }>;
  };
}

function getApiKey(): string {
  const key = process.env.WEATHERAPI_KEY;
  if (!key) {
    throw new Error(
      "Weather API is not configured. Set WEATHERAPI_KEY in .env.local.",
    );
  }
  return key;
}

/** Fetch current weather + 7-day forecast for a city name. */
export async function fetchWeatherForCity(
  city: string,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    key: getApiKey(),
    q: city,
    days: "7",
    aqi: "no",
  });

  const res = await fetch(`${BASE_URL}/forecast.json?${params}`, {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WeatherAPI error: ${res.status} ${body}`);
  }

  const data = (await res.json()) as WeatherApiCurrentResponse;

  return {
    temp_c: data.current.temp_c,
    humidity: data.current.humidity,
    condition: data.current.condition.text,
    location: data.location.name,
    forecast:
      data.forecast?.forecastday.map((day) => ({
        date: day.date,
        daily_chance_of_rain: day.day.daily_chance_of_rain,
        maxtemp_c: day.day.maxtemp_c,
        mintemp_c: day.day.mintemp_c,
        condition: day.day.condition.text,
      })) ?? [],
  };
}

/** Plain-text block for Gemini prompts. */
export function formatWeatherForPrompt(snapshot: WeatherSnapshot): string {
  const lines = [
    `Location: ${snapshot.location}`,
    `Current: ${snapshot.temp_c}°C, ${snapshot.humidity}% humidity, ${snapshot.condition}`,
    "7-day forecast:",
  ];
  for (const day of snapshot.forecast) {
    lines.push(
      `- ${day.date}: ${day.condition}, rain ${day.daily_chance_of_rain}%, ${day.mintemp_c}-${day.maxtemp_c}°C`,
    );
  }
  return lines.join("\n");
}
