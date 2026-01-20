import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Importamos lo nuestro
import { SearchBarComponent } from '../shared/molecules/search-bar/search-bar.component';
// 1. IMPORTAR EL NUEVO ORGANISMO AQUÍ
import { CurrentWeatherComponent } from '../shared/organisms/current-weather/current-weather.component';
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
    CurrentWeatherComponent // <--- 2. AÑADIRLO AQUÍ PARA PODER USARLO EN HTML
  ]
})
export class HomePage {

  weatherData: WeatherResult | null = null;
  loading: boolean = false;

  constructor(private weatherService: WeatherService) {}

  async onSearch(city: string) {
    this.loading = true;
    this.weatherData = null; // Limpiamos datos anteriores mientras busca
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
        // Aquí podrías poner un Toast de error en el futuro
      }
    });
  }

  onGps() {
    console.log('GPS pulsado (pendiente de implementar)');
  }
}