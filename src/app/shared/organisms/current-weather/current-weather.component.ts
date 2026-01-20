import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// Importamos la interfaz para saber qué datos nos llegan
import { CurrentWeather } from 'src/app/core/interfaces/weather-data';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule] // Importante para usar pipes y componentes ionic
})
export class CurrentWeatherComponent {

  // @Input significa: "Papá (Home), dame estos datos por favor"
  @Input() current!: CurrentWeather;

  constructor() { }

}
