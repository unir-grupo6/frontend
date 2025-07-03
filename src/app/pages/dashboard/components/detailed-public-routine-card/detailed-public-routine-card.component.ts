import { Component, inject, Input } from '@angular/core';
import { IPublicRoutine } from '../../../../interfaces/ipublic-routine.interface';

import { toast } from 'ngx-sonner'
import { RoutinesService } from '../../../../services/routines.service';
import { IRoutine } from '../../../../interfaces/iroutine.interface';

@Component({
  selector: 'app-detailed-public-routine-card',
  imports: [],
  templateUrl: './detailed-public-routine-card.component.html',
  styleUrl: './detailed-public-routine-card.component.css'
})
export class DetailedPublicRoutineCardComponent {
  // @Input() rutina: IPublicRoutine | null;
  @Input() rutina: any;

  routinesService = inject(RoutinesService);

  selectedExerciseList: IRoutine | null = null;

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywiZXhwIjoxNzUyMTQ5OTU0LCJpYXQiOjE3NTE1NDUxNTR9.XpetJTMcrn036rAGmWlDdaufhmKffyQTS0P1JnQpWeI';

  async saveRoutine(id_rutina: number): Promise<void> {
    console.log(`Saving routine: ${id_rutina}`, this.rutina);
    
    try {
      const response = await this.routinesService.savePublicRoutine(this.token, id_rutina);

      if (response && this.isIRoutine(response)) {
        toast.success('Rutina guardada en Mis Rutinas');
      } else {
        toast.error('Error al guardar la rutina');
      }

    } catch (error) {
      toast.error('Error al guardar la rutina');
    }
  }

  isIRoutine(obj: any): obj is IRoutine {
    return obj && typeof obj.rutina_id === 'number' && typeof obj.nombre === 'string';
  }

  openModal(rutina: IRoutine) {
    this.selectedExerciseList = rutina;
  }
  
  closeModal() {
    this.selectedExerciseList = null;
  }
}