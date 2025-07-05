import { Component, inject } from '@angular/core';
import { ListRoutinesCardComponent } from "../list-routines-card/list-routines-card.component";
import { RoutinesListService } from '../../../../services/routines-list.service';
import { IRoutinesList } from '../../../../interfaces/iroutines-list.interface';
import { IGoal } from '../../../../interfaces/igoal.interface';
import { IDifficulty } from '../../../../interfaces/idifficulty.interface';

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

  objetivosList: IGoal[] = [
    { id: 1, id_metodos: 1, nombre: 'Adaptación general' },
    { id: 2, id_metodos: 2, nombre: 'Tonificación' },
    { id: 3, id_metodos: 3, nombre: 'Hipertrofia' },
    { id: 4, id_metodos: 4, nombre: 'Pérdida de grasa' },
    { id: 5, id_metodos: 3, nombre: 'Rendimiento funcional' }
  ];

  dificultadList: IDifficulty[] = [
    { id: 1, nivel: 'Principiante' },
    { id: 2, nivel: 'Intermedio' },
    { id: 3, nivel: 'Avanzado' },
    { id: 4, nivel: 'Experto' }
  ];

  selectedObjetivoId: number | null = null;
  selectedDificultadId: number | null = null;

get selectedObjetivoNombre(): string {
  const obj = this.objetivosList.find(o => o.id === this.selectedObjetivoId);
  return obj ? obj.nombre : 'Objetivos';
}
isObjetivoDropdownOpen = false;
async onSelectObjetivo(id: number) {
  this.selectedObjetivoId = id;
  this.isObjetivoDropdownOpen = false;
  await this.applyFilters();
}

  async ngOnInit() {
    await this.loadRutinas();
  }

  async loadRutinas() {
  try {
    this.allRutinasListsOriginal = await this.routinesListService.getRoutinesList();
    this.currentPage = 1;
    this.updateShownRutinas();
  } catch (error) {
    console.error('Error cargando rutinas:', error);
  }
}

  togglePersonalized(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isToggleOn = input.checked;
    // Si desactivas el toggle recarga todas las rutinas
    if (!this.isToggleOn) {
      this.selectedObjetivoId = null;
      this.selectedDificultadId = null;
      this.loadRutinas();
    }
  }

  

isDificultadDropdownOpen = false;

get selectedDificultadNivel(): string {
  const dif = this.dificultadList.find(d => d.id === this.selectedDificultadId);
  return dif ? dif.nivel : 'Dificultad';
}

async onSelectDificultad(id: number) {
  this.selectedDificultadId = id;
  this.isDificultadDropdownOpen = false;
  await this.applyFilters();
}

async applyFilters() {
  try {
    if (this.selectedObjetivoId && this.selectedDificultadId) {
      this.allRutinasListsOriginal = await this.routinesListService.getFilteredRoutinesList(
        this.selectedObjetivoId,
        this.selectedDificultadId
      );
    } else {
      this.allRutinasListsOriginal = await this.routinesListService.getRoutinesList();
    }
    this.currentPage = 1;
    this.updateShownRutinas();
  } catch (error) {
    console.error('Error aplicando filtros:', error);
  }
}

currentPage: number = 1;
pageSize: number = 3;

get totalPages(): number {
  return Math.ceil(this.allRutinasListsOriginal.length / this.pageSize) || 1;
}

shownRutinas: IRoutinesList[] = [];
private allRutinasListsOriginal: IRoutinesList[] = [];

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updateShownRutinas();
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateShownRutinas();
  }
}

updateShownRutinas() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.shownRutinas = this.allRutinasListsOriginal.slice(start, end);
}

}
