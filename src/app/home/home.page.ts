import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Importamos lo nuestro
import { SearchBarComponent } from '../shared/molecules/search-bar/search-bar.component';
import { WeatherService } from '../core/services/weather.service';
import { WeatherResult } from '../core/interfaces/weather-data'; // Ojo con el nombre de tu archivo

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SearchBarComponent] // <--- Añadimos SearchBarComponent
})
export class HomePage {

  weatherData: WeatherResult | null = null;
  loading: boolean = false;

  constructor(private weatherService: WeatherService) {}

  // Esta función se ejecuta cuando la molécula emite el evento "search"
  async onSearch(city: string) {
    this.loading = true;
    console.log('Buscando ciudad:', city);

    this.weatherService.getWeatherByCity(city).subscribe({
      next: (result) => {
        this.weatherData = result;
        this.loading = false;
        console.log('Datos recibidos de la API:', result); // <--- AQUÍ VEREMOS LA MAGIA
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  // Pendiente para más adelante
  onGps() {
    console.log('GPS pulsado (pendiente de implementar)');
  }
}