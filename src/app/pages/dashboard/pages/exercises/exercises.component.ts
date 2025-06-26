import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Modal } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { DashboardCardComponent } from "../../components/dashboard-card/dashboard-card.component";

@Component({
  selector: 'app-exercises',
  imports: [CommonModule, DashboardCardComponent, FormsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css'
})
export class ExercisesComponent {
categorias = ['Todos', 'Fuerza', 'Aislamiento', 'Core', 'Cardio'];
categoriaSeleccionada = 'Todos';

ActivarCategoria(categoria: string) {
  this.categoriaSeleccionada = categoria;
}


 modal!: Modal;
 

  ngAfterViewInit() {
    const modalEl = document.getElementById('modalEl');
    if(modalEl){
      this.modal = new Modal(modalEl, {
        placement: 'bottom-right',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
        closable: true,
        onHide: () => console.log('modal is hidden'),
        onShow: () => console.log('modal is shown'),
        onToggle: () => console.log('modal has been toggled'),
      });
    }
  }


  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }
ejercicios: any[] = [/* array con todos los ejercicios */]
paginaActual = 0;
ejerciciosPorPagina = 6;
siguientePagina() {
    if ((this.paginaActual + 1) * this.ejerciciosPorPagina < this.ejercicios.length) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

}



