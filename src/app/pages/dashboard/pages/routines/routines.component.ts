import { Component, inject } from '@angular/core';
import { DetailedRoutineCardComponent } from '../../components/detailed-routine-card/detailed-routine-card.component';
import { DiscoverRoutinesCardComponent } from "../../components/discover-routines-card/discover-routines-card.component";
import { IRoutine } from '../../../../interfaces/iroutine.interface';
import { RoutinesService } from '../../../../services/routines.service';
import { IRoutinesList } from '../../../../interfaces/iroutines-list.interface';
import { PublicRoutinesComponent } from "../../components/public-routines/public-routines.component";
import { IPublicRoutine } from '../../../../interfaces/ipublic-routine.interface';


@Component({
  selector: 'app-routines',
  imports: [DiscoverRoutinesCardComponent, PublicRoutinesComponent, DetailedRoutineCardComponent],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.css',
})
export class RoutinesComponent {
  // Tabs
  tabs = [
    { key: 'misrutinas', label: 'Mis Rutinas' },
    { key: 'sugerencias', label: 'Sugerencias' },
    { key: 'descubrir', label: 'Descubrir' },
  ];
  activeTab = 'misrutinas';
  selectTab(key: string) {
    this.activeTab = key;
  }

  // Inyecciones y datos
  routinesService = inject(RoutinesService);

  // Datos originales
  userRoutines: IRoutine[] = [];
  suggestedRoutines: IRoutinesList[] = [];
  discoverRoutines: IPublicRoutine[] = [];

  // --- PAGINACIÓN DE userRoutines ---
  currentUserRoutinePage = 1;
  userRoutinePageSize = 3;
  shownUserRoutines: IRoutine[] = [];

  get totalUserRoutinePages(): number {
    return Math.ceil(this.userRoutines.length / this.userRoutinePageSize) || 1;
  }

  updateShownUserRoutines() {
    const start = (this.currentUserRoutinePage - 1) * this.userRoutinePageSize;
    const end = start + this.userRoutinePageSize;
    this.shownUserRoutines = this.userRoutines.slice(start, end);
  }

  nextUserRoutinePage() {
    if (this.currentUserRoutinePage < this.totalUserRoutinePages) {
      this.currentUserRoutinePage++;
      this.updateShownUserRoutines();
    }
  }

  previousUserRoutinePage() {
    if (this.currentUserRoutinePage > 1) {
      this.currentUserRoutinePage--;
      this.updateShownUserRoutines();
    }
  }
  // --- FIN PAGINACIÓN ---

  async ngOnInit() {
    try {
      await this.refreshUserRoutines();

      // Iniciamos la primera "página"
      this.currentUserRoutinePage = 1;
      this.updateShownUserRoutines();

    } catch (error) {
      console.error('Error al cargar las rutinas:', error);
    }
  }

  async refreshUserRoutines() {
    const userData = await this.routinesService.getUserRoutines()
    this.userRoutines = userData.rutinas;
    this.updateShownUserRoutines();
  }
}