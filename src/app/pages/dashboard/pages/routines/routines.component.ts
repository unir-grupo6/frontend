import { Component, inject } from '@angular/core';
import { OverviewRoutineCardComponent } from '../../components/overview-routine-card/overview-routine-card.component';
import { DetailedRoutineCardComponent } from '../../components/detailed-routine-card/detailed-routine-card.component';
import { RouterLink } from '@angular/router';
import { DiscoverRoutinesCardComponent } from "../../components/discover-routines-card/discover-routines-card.component";
import { IRoutine } from '../../../../interfaces/iroutine.interface';
import { RoutinesService } from '../../../../services/routines.service';
import { IRoutinesList } from '../../../../interfaces/iroutines-list.interface';

@Component({
  selector: 'app-routines',
  imports: [DetailedRoutineCardComponent, RouterLink, DiscoverRoutinesCardComponent],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.css',
})
export class RoutinesComponent {
  /* Lógica de las pestañas de tabulación */
  tabs = [
    { key: 'misrutinas', label: 'Mis Rutinas' },
    { key: 'sugerencias', label: 'Sugerencias' },
    { key: 'descubrir', label: 'Descubrir' },
  ];

  activeTab = 'misrutinas';

  selectTab(key: string) {
    this.activeTab = key;
  }

  routinesService = inject(RoutinesService)
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTE1MzM3MjksImlhdCI6MTc1MTUzMTkyOX0.RsZFaJhmx1mSEegzH9gQMqXnPpP956mu1gI49hccNMw'

  userRoutines: IRoutine[] = [];
  suggestedRoutines: IRoutinesList[] = [];
  discoverRoutines: IRoutinesList[] = [];

  async ngOnInit() {
    try {
      // const token = localStorage.getItem('token') ?? '';
      const userData = await this.routinesService.getUserRoutines(this.token); // Obtiene las rutinas del usuario
      this.userRoutines = userData.rutinas;

      console.log('Rutinas del usuario:', this.userRoutines);
      // Aquí podrías agregar lógica para obtener sugerencias y rutinas para descubrir
      // Crear otro método en el servicio

    } catch (error) {
      console.error('Error al cargar las rutinas:', error);
    }
  }
}
