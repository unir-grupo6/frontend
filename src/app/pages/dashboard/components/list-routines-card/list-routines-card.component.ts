import { Component, Input, inject } from '@angular/core';
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

  routinesService = inject(RoutinesService);
  
  selectedExerciseList: IRoutinesList | null = null;

  openModal(rutina: IRoutinesList) {
    this.selectedExerciseList = rutina;
  }

  closeModal() {
    this.selectedExerciseList = null;
  }

  async saveRoutine(id_rutina: number): Promise<void> {
    try {
      const response = await this.routinesService.savePublicRoutine(id_rutina);

      if (response) {
        toast.success('Rutina guardada en Mis Rutinas');
      } else {
        toast.error('Error al guardar la rutina');
      }
    } catch (error) {
      toast.error('Error al guardar la rutina');
    }
  }
}

