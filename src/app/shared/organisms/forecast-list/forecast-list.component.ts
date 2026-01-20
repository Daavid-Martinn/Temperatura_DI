import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ForecastItemComponent } from '../../molecules/forecast-item/forecast-item.component';
import { ForecastItem } from 'src/app/core/interfaces/weather-data';

@Component({
  selector: 'app-forecast-list',
  templateUrl: './forecast-list.component.html',
  styleUrls: ['./forecast-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ForecastItemComponent] // Importamos la molécula
})
export class ForecastListComponent {
  @Input() items: ForecastItem[] = [];
  @Input() title: string = ''; // Para poder poner "Hoy" o "Próximos días"
}