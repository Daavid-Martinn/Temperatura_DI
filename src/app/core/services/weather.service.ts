import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WeatherResult } from '../interfaces/weather-data'; 
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  
  private apiKey = environment.weatherApiKey;
  private baseUrl = environment.weatherApiUrl; 
  private geoUrl = 'https://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient, private platform: Platform) { }

  // 1. HELPER PARA HACER PETICIONES NATIVAS (SOLUCIONA EL ERROR STATUS 0 EN ANDROID)
  private nativeGet(url: string): Observable<any> {
    // Si estamos en WEB (navegador), usamos HttpClient normal para evitar problemas de CORS/Headers de Capacitor
    if (!this.platform.is('hybrid')) {
      return this.http.get(url);
    }

    // Si estamos en NATIVO (Android/iOS), usamos CapacitorHttp
    return from(CapacitorHttp.get({ url })).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error(JSON.stringify(response));
        }
        return response.data;
      })
    );
  }

  // 2. USAMOS nativeGet EN LUGAR DE this.http.get
  getWeatherByCity(city: string, lang: string = 'es'): Observable<WeatherResult | null> {
    const url = `${this.geoUrl}?q=${city}&limit=1&appid=${this.apiKey}`;
    
    return this.nativeGet(url).pipe(
      switchMap((geoData: any) => {
        if (!geoData || geoData.length === 0) {
          return of(null);
        }
        const { lat, lon } = geoData[0];
        return this.getWeatherByCoords(lat, lon, lang);
      })
    );
  }

  getWeatherByCoords(lat: number, lon: number, lang: string = 'es'): Observable<WeatherResult> {
    // 3. AQUI TAMBIEN USAMOS nativeGet
    const currentUrl = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${this.apiKey}`;
    const forecastUrl = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${this.apiKey}`;

    const currentReq = this.nativeGet(currentUrl);
    const forecastReq = this.nativeGet(forecastUrl);

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