import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation'; // <--- Importante para el GPS

// --- TUS COMPONENTES (Átomos/Moléculas/Organismos) ---
import { SearchBarComponent } from '../shared/molecules/search-bar/search-bar.component';
import { CurrentWeatherComponent } from '../shared/organisms/current-weather/current-weather.component';
import { ForecastListComponent } from '../shared/organisms/forecast-list/forecast-list.component';

// --- CORE ---
import { WeatherService } from '../core/services/weather.service';
import { WeatherResult } from '../core/interfaces/weather-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    SearchBarComponent, 
    CurrentWeatherComponent,
    ForecastListComponent
  ]
})
export class HomePage {

  weatherData: WeatherResult | null = null;
  loading: boolean = false;

  constructor(private weatherService: WeatherService) {}

  // Buscar por nombre de ciudad (Texto)
  async onSearch(city: string) {
    this.loading = true;
    this.weatherData = null; 
    console.log('Buscando ciudad:', city);

    this.weatherService.getWeatherByCity(city).subscribe({
      next: (result) => {
        this.weatherData = result;
        this.loading = false;
        console.log('Datos recibidos:', result);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  // Buscar por GPS (Geolocalización)
  async onGps() {
    this.loading = true;
    this.weatherData = null; // Limpiamos datos anteriores
    console.log("Intentando obtener ubicación...");

    try {
      // 1. Pedir coordenadas al dispositivo
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lon = coordinates.coords.longitude;

      console.log("Coordenadas obtenidas:", lat, lon);

      // 2. Llamar a la API con esas coordenadas
      this.weatherService.getWeatherByCoords(lat, lon).subscribe({
        next: (result) => {
          this.weatherData = result;
          this.loading = false;
        },
        error: (err) => {
          console.error("Error conectando con OpenWeather:", err);
          this.loading = false;
        }
      });

    } catch (error) {
      console.error("Error obteniendo ubicación o permisos denegados:", error);
      this.loading = false;
      // Aquí podrías mostrar un aviso si el usuario deniega el permiso
    }
  }
}