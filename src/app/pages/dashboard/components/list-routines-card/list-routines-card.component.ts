import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IRoutinesList } from '../../../../interfaces/iroutines-list.interface';
import { RoutinesService } from '../../../../services/routines.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-list-routines-card',
  imports: [],
  templateUrl: './list-routines-card.component.html',
  styleUrl: './list-routines-card.component.css'
})
export class ListRoutinesCardComponent {
  @Input() rutinaList!: IRoutinesList;
  @Output() refreshUserRoutines = new EventEmitter<void>();

  routinesService = inject(RoutinesService);
  
  selectedExerciseList: IRoutinesList | null = null;

  openModal(rutina: IRoutinesList) {
    this.selectedExerciseList = rutina;
  }

  closeModal() {
    this.selectedExerciseList = null;
  }

  async saveNewRoutine(id_rutina: number): Promise<void> {
    try {
      const response = await this.routinesService.addNewRoutine(id_rutina);

      if (response) {
        this.refreshUserRoutines.emit();
        toast.success('Rutina guardada en Mis Rutinas');
      } else {
        toast.error('Error al guardar la rutina');
      }
    } catch (error) {
      toast.error('Error al guardar la rutina');
    }
  }
}

