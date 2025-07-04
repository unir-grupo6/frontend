import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoutinesService } from '../../../../services/routines.service';
import { toast } from 'ngx-sonner'

@Component({
  selector: 'app-detailed-routine-card',
  imports: [RouterLink],
  templateUrl: './detailed-routine-card.component.html',
  styleUrl: './detailed-routine-card.component.css',
})
export class DetailedRoutineCardComponent {
  @Input() rutina: any;
  routinesService = inject(RoutinesService);

  getNombreDia(dia: number): string {
    const dias = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    return dias[dia - 1] || 'N/A';
  }

  async deleteRoutine(id: string) {
    // confirmacion antes de borrar
    const id_rutina = parseInt(id);
    try {
      await this.routinesService.deleteRoutine(id_rutina);
      toast.success('Rutina eliminada correctamente.')
    } catch (error) {
      console.log("Error al eliminar la rutina con id: ", id)
    }
  }
}
