import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { addIcons } from 'ionicons';
import { alertCircleOutline, thunderstormOutline, waterOutline, paperPlaneOutline, rainyOutline, thermometerOutline } from 'ionicons/icons';

// IMPORTAMOS EL SERVICIO DE TRADUCCIÓN
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SearchBarComponent } from '../shared/molecules/search-bar/search-bar.component';
import { CurrentWeatherComponent } from '../shared/organisms/current-weather/current-weather.component';
import { ForecastListComponent } from '../shared/organisms/forecast-list/forecast-list.component';
import { WeatherService } from '../core/services/weather.service';
import { WeatherResult } from '../core/interfaces/weather-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, FormsModule, TranslateModule, // <--- IMPORTANTE
    SearchBarComponent, CurrentWeatherComponent, ForecastListComponent
  ],
  host: {
    class: 'ion-page'
  }
})
export class HomePage {

  weatherData: WeatherResult | null = null;
  loading: boolean = false;
  hasError: boolean = false;
  
  next24Hours: any[] = [];
  nextDaysGrouped: any[] = [];
  selectedForecast: any = null;
  isModalOpen: boolean = false;

  // VARIABLE PARA EL IDIOMA ACTUAL
  currentLang: string = 'es'; 
  lastCitySearched: string = '';

  constructor(
    private weatherService: WeatherService,
    private toastController: ToastController,
    private translate: TranslateService // <--- INYECTAMOS
  ) {
    // Registramos TODOS los iconos
    addIcons({ alertCircleOutline, thunderstormOutline, waterOutline, paperPlaneOutline, rainyOutline, thermometerOutline });
    
    // --- CONFIGURACIÓN DE IDIOMA ---
    this.translate.setDefaultLang('es'); // Idioma por defecto si falla otro
    this.translate.use('es');            // Forzamos que empiece en ESPAÑOL
  }

  // --- FUNCIÓN PARA CAMBIAR IDIOMA (BANDERAS) ---
  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang); // Cambia los textos de la app

    // Si ya hay datos cargados, recargamos la llamada a la API en el nuevo idioma
    if (this.lastCitySearched) {
      this.onSearch(this.lastCitySearched);
    } else if (this.weatherData) {
      this.onGps();
    }
  }

  async onSearch(city: string) {
    this.loading = true;
    this.weatherData = null;
    this.hasError = false;
    this.lastCitySearched = city;
    
    // Pasamos el idioma actual (this.currentLang) a la API
    this.weatherService.getWeatherByCity(city, this.currentLang).subscribe({
      next: (result) => {
        if (result) {
          this.processWeatherData(result);
        } else {
          this.hasError = true;
          this.translate.get('ERROR_NOT_FOUND').subscribe(res => this.presentErrorToast(res));
        }
        this.loading = false;
      },
      error: (err) => {
        this.hasError = true;
        // DEBUG: Mostrar error en alerta
        alert('Error API: ' + JSON.stringify(err));
        console.error(err);
        this.translate.get('ERROR_CONNECTION').subscribe(res => this.presentErrorToast(res));
        this.loading = false;
      }
    });
  }

  async onGps() {
    this.loading = true;
    this.weatherData = null;
    this.hasError = false;
    this.lastCitySearched = ''; 

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      // Pasamos el idioma actual
      this.weatherService.getWeatherByCoords(coordinates.coords.latitude, coordinates.coords.longitude, this.currentLang)
        .subscribe({
          next: (result) => {
            if (result) {
              this.processWeatherData(result);
            } else {
              this.hasError = true;
              this.translate.get('ERROR_GPS').subscribe(res => this.presentErrorToast(res));
            }
            this.loading = false;
          },
          error: (err) => {
            this.hasError = true;
            this.translate.get('ERROR_CONNECTION').subscribe(res => this.presentErrorToast(res));
            this.loading = false;
          }
        });
    } catch (error) {
      this.hasError = true;
      this.translate.get('ERROR_GPS').subscribe(res => this.presentErrorToast(res));
      this.loading = false;
    }
  }

  private processWeatherData(result: WeatherResult) {
    this.weatherData = result;
    this.next24Hours = result.forecast.slice(0, 8);
    const remainingForecast = result.forecast.slice(8);
    this.nextDaysGrouped = this.groupByDay(remainingForecast);
  }

  private groupByDay(list: any[]): any[] {
    const groups: { [key: string]: any[] } = {};
    list.forEach(item => {
      const dateKey = item.date.split(' ')[0]; 
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return Object.keys(groups).map(date => ({
      date: date,
      items: groups[date]
    }));
  }

  openForecastDetail(item: any) {
    this.selectedForecast = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedForecast = null;
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      icon: 'alert-circle-outline',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}