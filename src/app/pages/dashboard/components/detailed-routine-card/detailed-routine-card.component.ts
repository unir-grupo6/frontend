import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detailed-routine-card',
  imports: [RouterLink],
  templateUrl: './detailed-routine-card.component.html',
  styleUrl: './detailed-routine-card.component.css',
})
export class DetailedRoutineCardComponent {
  @Input() rutina: any;

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
}
