import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// --- TUS COMPONENTES (Átomos/Moléculas/Organismos) ---
import { SearchBarComponent } from '../shared/molecules/search-bar/search-bar.component';
import { CurrentWeatherComponent } from '../shared/organisms/current-weather/current-weather.component';
import { ForecastListComponent } from '../shared/organisms/forecast-list/forecast-list.component'; // <--- 1. NUEVO IMPORT

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
    ForecastListComponent // <--- 2. AÑADIR AL ARRAY DE IMPORTS
  ]
})
export class HomePage {

  weatherData: WeatherResult | null = null;
  loading: boolean = false;

  constructor(private weatherService: WeatherService) {}

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

  onGps() {
    console.log('GPS pulsado (pendiente de implementar)');
  }
}