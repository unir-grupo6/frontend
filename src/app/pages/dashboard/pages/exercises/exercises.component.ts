import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-exercises',
  imports: [CommonModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css'
})
export class ExercisesComponent {
categorias = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Brazos', 'Hombros'];
categoriaSeleccionada = 'Todos';

ActivarCategoria(categoria: string) {
  this.categoriaSeleccionada = categoria;
}
}
