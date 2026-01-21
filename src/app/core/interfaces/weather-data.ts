// src/app/core/interfaces/weather-data.ts

// 1. El objeto principal que devuelve nuestro servicio
export interface WeatherResult {
  current: CurrentWeather;
  forecast: ForecastItem[];
}

// 2. Modelo para el clima actual
export interface CurrentWeather {
  city: string;
  temp: number;
  description: string;
  icon: string;
  windSpeed: number;
  humidity: number;
  uvIndex?: number; // Es opcional (?) porque a veces la API básica no lo trae
  feelsLike: number;
  date: Date;
  precip?: number; 
}

// 3. Modelo para cada ítem de la predicción (horas o días)
export interface ForecastItem {
  date: string;        // Fecha en texto "2026-01-25 15:00:00"
  temp: number;
  tempMin?: number;
  tempMax?: number;
  icon: string;
  description: string;
  isDailySummary?: boolean;
  windSpeed: number;
  humidity: number;
  feelsLike: number;
  precip: number;
}