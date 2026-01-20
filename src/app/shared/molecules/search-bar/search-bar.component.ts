import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class SearchBarComponent {
  
  searchTerm: string = '';

  // Eventos para avisar al padre (Home)
  @Output() search = new EventEmitter<string>();
  @Output() gps = new EventEmitter<void>();

  constructor() { }

  triggerSearch() {
    if (this.searchTerm.trim().length > 0) {
      this.search.emit(this.searchTerm);
    }
  }

  triggerGps() {
    this.gps.emit();
  }
}
