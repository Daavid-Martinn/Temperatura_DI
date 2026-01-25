import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Keyboard } from '@capacitor/keyboard';

// 1. Importamos los iconos que vamos a usar
// 1. Importamos los iconos que vamos a usar
import { addIcons } from 'ionicons';
import { search, locate } from 'ionicons/icons';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class SearchBarComponent {
  
  searchTerm: string = '';

  @Output() search = new EventEmitter<string>();
  @Output() gps = new EventEmitter<void>();

  constructor() {
    // 2. Los registramos para que Ionic sepa dibujarlos
    addIcons({ search, locate });
  }

  async triggerSearch() {
    if (this.searchTerm.trim().length > 0) {
      // Ocultar teclado si está abierto
      try {
        await Keyboard.hide();
      } catch (e) {
        // Ignorar error si no estamos en móvil
      }
      this.search.emit(this.searchTerm);
    }
  }

  triggerGps() {
    this.gps.emit();
  }
}
