import { Component, inject } from '@angular/core';
import { OverviewRoutineCardComponent } from '../../components/overview-routine-card/overview-routine-card.component';
import { DetailedRoutineCardComponent } from '../../components/detailed-routine-card/detailed-routine-card.component';
import { RouterLink } from '@angular/router';
import { DiscoverRoutinesCardComponent } from "../../components/discover-routines-card/discover-routines-card.component";
import { IRoutine } from '../../../../interfaces/iroutine.interface';
import { RoutinesService } from '../../../../services/routines.service';
import { IRoutinesList } from '../../../../interfaces/iroutines-list.interface';
import { PublicRoutinesComponent } from "../../components/public-routines/public-routines.component";
import { IPublicRoutine } from '../../../../interfaces/ipublic-routine.interface';
import { DetailedPublicRoutineCardComponent } from "../../components/detailed-public-routine-card/detailed-public-routine-card.component";

@Component({
  selector: 'app-routines',
  imports: [DetailedRoutineCardComponent, RouterLink, DiscoverRoutinesCardComponent, PublicRoutinesComponent],
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
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywiZXhwIjoxNzUyMTQ5OTU0LCJpYXQiOjE3NTE1NDUxNTR9.XpetJTMcrn036rAGmWlDdaufhmKffyQTS0P1JnQpWeI'

  userRoutines: IRoutine[] = [];
  suggestedRoutines: IRoutinesList[] = [];
  discoverRoutines: IPublicRoutine[] = [];

  async ngOnInit() {
    try {
      // const token = localStorage.getItem('token') ?? '';
      const userData = await this.routinesService.getUserRoutines(this.token); // Obtiene las rutinas del usuario
      this.userRoutines = userData.rutinas;


      console.log('Rutinas del usuario:', this.userRoutines);
      console.log('Rutinas públicas descubiertas:', this.discoverRoutines);
      // Aquí podrías agregar lógica para obtener sugerencias y rutinas para descubrir
      // Crear otro método en el servicio

    } catch (error) {
      console.error('Error al cargar las rutinas:', error);
    }
  }
}