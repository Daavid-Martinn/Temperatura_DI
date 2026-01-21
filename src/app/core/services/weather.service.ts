import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WeatherResult } from '../interfaces/weather-data'; 

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  
  private apiKey = environment.weatherApiKey;
  private baseUrl = environment.weatherApiUrl; 
  private geoUrl = 'http://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) { }

  // 1. ACEPTAMOS EL PARÁMETRO LANG (Por defecto 'es')
  getWeatherByCity(city: string, lang: string = 'es'): Observable<WeatherResult | null> {
    return this.http.get<any[]>(`${this.geoUrl}?q=${city}&limit=1&appid=${this.apiKey}`).pipe(
      switchMap(geoData => {
        if (!geoData || geoData.length === 0) {
          return of(null);
        }
        const { lat, lon } = geoData[0];
        // Pasamos el idioma a la siguiente función
        return this.getWeatherByCoords(lat, lon, lang);
      })
    );
  }

  // 2. ACEPTAMOS EL PARÁMETRO LANG AQUÍ TAMBIÉN
  getWeatherByCoords(lat: number, lon: number, lang: string = 'es'): Observable<WeatherResult> {
    
    // 3. INYECTAMOS LA VARIABLE ${lang} EN LAS URLS (antes ponía lang=es fijo)
    const currentReq = this.http.get(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${this.apiKey}`);
    const forecastReq = this.http.get(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${this.apiKey}`);

    return forkJoin([currentReq, forecastReq]).pipe(
      map((responses: any[]) => {
        const currentData = responses[0];
        const forecastData = responses[1];

        // Probabilidad de lluvia actual (sacada del pronóstico inmediato)
        const rainProb = forecastData.list[0].pop ? Math.round(forecastData.list[0].pop * 100) : 0;

        // Índice UV simulado (0-11)
        const simulatedUV = Math.floor(Math.random() * 12); 

        return {
          current: {
            city: currentData.name,
            temp: Math.round(currentData.main.temp),
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
            windSpeed: currentData.wind.speed,
            humidity: currentData.main.humidity,
            feelsLike: Math.round(currentData.main.feels_like),
            date: new Date(currentData.dt * 1000),
            uvIndex: simulatedUV, 
            precip: rainProb 
          },
          forecast: forecastData.list.map((item: any) => ({
            date: item.dt_txt,
            temp: Math.round(item.main.temp),
            icon: item.weather[0].icon,
            description: item.weather[0].description,
            isDailySummary: item.dt_txt.includes('15:00:00'),
            
            // Datos extra para el detalle:
            windSpeed: item.wind.speed,
            humidity: item.main.humidity,
            feelsLike: Math.round(item.main.feels_like),
            precip: item.pop ? Math.round(item.pop * 100) : 0
          }))
        };
      })
    );
  }
}