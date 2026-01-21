import { Component, Input, Output, EventEmitter } from '@angular/core'; // <--- Importamos Output y EventEmitter
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ForecastItemComponent } from '../../molecules/forecast-item/forecast-item.component';
import { ForecastItem } from 'src/app/core/interfaces/weather-data';

@Component({
  selector: 'app-forecast-list',
  templateUrl: './forecast-list.component.html',
  styleUrls: ['./forecast-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ForecastItemComponent]
})
export class ForecastListComponent {
  
  @Input() items: ForecastItem[] = []; // O 'any[]' si te da problemas de tipos
  @Input() title: string = '';

  // Evento que avisa al padre (Home) cuando se hace clic
  @Output() itemClick = new EventEmitter<ForecastItem>();

  // Función que llama el HTML
  onItemClicked(item: ForecastItem) {
    this.itemClick.emit(item);
  }
}