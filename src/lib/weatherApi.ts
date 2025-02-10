export interface WeatherForecast {
  time: string[];
  temperature: number[];
  weatherCode: number[];
  precipitation: number[];
}

const WMO_CODES: { [key: number]: string } = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  95: "Thunderstorm",
};

export function getWeatherDescription(code: number): string {
  return WMO_CODES[code] || "Unknown";
}

export async function getWeatherForecast(): Promise<WeatherForecast> {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?" +
    "latitude=47.3619&" +
    "longitude=8.5744&" +
    "hourly=temperature_2m,precipitation_probability,weathercode&" +
    "timezone=Europe%2FZurich&" +
    "forecast_days=3"
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  return {
    time: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    weatherCode: data.hourly.weathercode,
    precipitation: data.hourly.precipitation_probability
  };
}
