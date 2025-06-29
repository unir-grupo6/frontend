import { Component, Input } from '@angular/core';
import { Modal } from 'flowbite';
import { IExercises } from '../../../../interfaces/iexercises.interface';

@Component({
  selector: 'app-dashboard-card',
  imports: [],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {
  @Input() myExercise?: IExercises;

dificultades: Record<number, string> = {
  1: 'Principiante',
  2: 'Intermedio',
  3: 'Avanzado',
  4: 'Experto',
  5: 'Elite'
};

gruposMusculares: Record<number, string> = {
  1: 'Pecho',
  2: 'Espalda',
  3: 'Bíceps',
  4: 'Tríceps',
  5: 'Hombros',
  6: 'Piernas',
  7: 'Glúteos',
  8: 'Abdominales',
  9: 'Cardio',
  10: 'Antebrazos',
  11: 'Trapecios',
  12: 'Cuádriceps',
  13: 'Isquiotibiales',
  14: 'Gemelos',
  15: 'Lumbares',
  16: 'Pectoral inferior',
  17: 'Dorsal ancho',
  18: 'Deltoides posterior',
  19: 'Core',
  20: 'Flexores de cadera'
};

modal!: Modal;

  ngAfterViewInit() {
  const id = `modalEl-${this.myExercise?.id}`;
  const modalEl = document.getElementById(id);
  if (modalEl) {
    this.modal = new Modal(modalEl, {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
      closable: true,
    });
  }
}

  openModal() {
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
  }
}
