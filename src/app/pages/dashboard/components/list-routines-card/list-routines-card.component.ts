import { Component, Input } from '@angular/core';
import { IRoutinesList, Ejercicio } from '../../../../interfaces/iroutines-list.interface';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-routines-card',
  imports: [RouterLink],
  templateUrl: './list-routines-card.component.html',
  styleUrl: './list-routines-card.component.css'
})
export class ListRoutinesCardComponent {
@Input() rutinaList!: IRoutinesList;

  selectedExerciseList: IRoutinesList | null = null;

openModal(rutina: IRoutinesList) {
  this.selectedExerciseList = rutina;
}

closeModal() {
  this.selectedExerciseList = null;
}
}