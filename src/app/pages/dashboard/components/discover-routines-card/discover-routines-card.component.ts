import { Component, inject } from '@angular/core';
import { ListRoutinesCardComponent } from "../list-routines-card/list-routines-card.component";
import { RoutinesListService } from '../../../../services/routines-list.service';
import { IRoutinesList } from '../../../../interfaces/iroutines-list.interface';

@Component({
  selector: 'app-discover-routines-card',
  imports: [ListRoutinesCardComponent],
  templateUrl: './discover-routines-card.component.html',
  styleUrl: './discover-routines-card.component.css'
})
export class DiscoverRoutinesCardComponent {
isToggleOn = false;
  routinesListService = inject(RoutinesListService);
  allRutinasLists: IRoutinesList[] = [];

  async ngOnInit() {
    await this.loadRutinas();
  }

  async loadRutinas() {
    try {
      this.allRutinasLists = await this.routinesListService.getRoutinesList()
      console.log('Rutinas cargadas:', this.allRutinasLists);;
    } catch (error) {
      console.error('Error cargando rutinas:', error);
    }
  }

  togglePersonalized(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isToggleOn = input.checked;

    // Si quieres recargar o filtrar cuando activas el toggle:
    // await this.loadRutinas();
    // O aplica aquí la lógica de filtro
  }
}
