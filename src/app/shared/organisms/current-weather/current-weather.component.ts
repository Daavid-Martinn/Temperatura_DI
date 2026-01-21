import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CurrentWeather } from 'src/app/core/interfaces/weather-data';

// 1. IMPORTAR ICONOS
import { addIcons } from 'ionicons';
import { paperPlaneOutline, rainyOutline, sunnyOutline, waterOutline, thermometerOutline } from 'ionicons/icons';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CurrentWeatherComponent {

  @Input() current!: CurrentWeather;

  constructor() { 
    // 2. REGISTRARLOS
    addIcons({ paperPlaneOutline, rainyOutline, sunnyOutline, waterOutline, thermometerOutline });
  }

}