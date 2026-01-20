// src/app/core/services/weather.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// Asegúrate de que la ruta de la interfaz sea correcta
import { WeatherResult } from '../interfaces/weather-data'; 

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  
  // Usamos las variables que definimos en environment
  private apiKey = environment.weatherApiKey;
  private baseUrl = environment.weatherApiUrl; // 'https://api.openweathermap.org/data/2.5'
  private geoUrl = 'http://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) { }

  /**
   * MÉTODO PRINCIPAL 1: Buscar por Nombre de Ciudad
   * 1. Llama a la API de Geocoding para sacar lat/lon.
   * 2. Si encuentra la ciudad, llama a getWeatherByCoords automáticamente.
   */
  getWeatherByCity(city: string): Observable<WeatherResult | null> {
    return this.http.get<any[]>(`${this.geoUrl}?q=${city}&limit=1&appid=${this.apiKey}`).pipe(
      switchMap(geoData => {
        if (!geoData || geoData.length === 0) {
          return of(null); // Ciudad no encontrada
        }
        const { lat, lon } = geoData[0];
        // Una vez tenemos coordenadas, pedimos el clima
        return this.getWeatherByCoords(lat, lon);
      })
    );
  }

  /**
   * MÉTODO PRINCIPAL 2: Buscar por Coordenadas (GPS)
   * Usa 'forkJoin' para hacer dos peticiones A LA VEZ:
   * 1. Clima Actual (weather)
   * 2. Predicción 5 días (forecast)
   */
  getWeatherByCoords(lat: number, lon: number): Observable<WeatherResult> {
    
    // Petición 1: Tiempo actual
    const currentReq = this.http.get(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${this.apiKey}`);
    
    // Petición 2: Predicción (bloques de 3 horas)
    const forecastReq = this.http.get(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${this.apiKey}`);

    // Unimos las dos respuestas en un solo objeto
    return forkJoin([currentReq, forecastReq]).pipe(
      map((responses: any[]) => {
        const currentData = responses[0];
        const forecastData = responses[1];

        // Aquí transformamos el JSON "feo" de la API en nuestra interfaz "bonita"
        return {
          current: {
            city: currentData.name,
            temp: Math.round(currentData.main.temp),
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
            windSpeed: currentData.wind.speed,
            humidity: currentData.main.humidity,
            feelsLike: Math.round(currentData.main.feels_like),
            date: new Date(currentData.dt * 1000) // Convertir timestamp unix a fecha JS
          },
          // Mapeamos la lista de predicciones
          forecast: forecastData.list.map((item: any) => ({
            date: item.dt_txt, // Fecha texto "2026-01-25 15:00:00"
            temp: Math.round(item.main.temp),
            icon: item.weather[0].icon,
            description: item.weather[0].description,
            // Truco: Si la hora es '12:00:00', marcamos como posible resumen del día
            isDailySummary: item.dt_txt.includes('15:00:00') 
          }))
        };
      })
    );
  }
}