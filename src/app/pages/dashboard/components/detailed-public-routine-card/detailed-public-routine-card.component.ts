import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  @Input() rutina: any;
  @Output() refreshUserRoutines = new EventEmitter<void>();

  routinesService = inject(RoutinesService);

  selectedExerciseList: IRoutine | null = null;

  async saveRoutine(id_rutina: number): Promise<void> {
    
    try {
      const response = await this.routinesService.savePublicRoutine(id_rutina);

      if (response && this.isIRoutine(response)) {
        this.refreshUserRoutines.emit();
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

  onRefreshUserRoutines() {
    this.refreshUserRoutines.emit();
  }
}