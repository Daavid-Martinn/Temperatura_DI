import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CurrentWeather } from 'src/app/core/interfaces/weather-data';
import { addIcons } from 'ionicons';
import { paperPlaneOutline, rainyOutline, sunnyOutline, waterOutline, thermometerOutline } from 'ionicons/icons';

// 1. IMPORTAR EL MÓDULO DE TRADUCCIÓN
import { TranslateModule } from '@ngx-translate/core'; 

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
  // 2. AÑADIRLO AQUÍ A LOS IMPORTS
  imports: [CommonModule, IonicModule, TranslateModule] 
})
export class CurrentWeatherComponent {
  @Input() current!: CurrentWeather;

  constructor() { 
    addIcons({ paperPlaneOutline, rainyOutline, sunnyOutline, waterOutline, thermometerOutline });
  }
}