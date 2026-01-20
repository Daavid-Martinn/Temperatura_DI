import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ForecastItem } from 'src/app/core/interfaces/weather-data';

@Component({
  selector: 'app-forecast-item',
  templateUrl: './forecast-item.component.html',
  styleUrls: ['./forecast-item.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ForecastItemComponent {
  @Input() item!: ForecastItem;
}