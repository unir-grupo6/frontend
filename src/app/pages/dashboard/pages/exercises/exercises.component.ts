import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { InstanceOptions, ModalInterface, ModalOptions, Modal } from 'flowbite';

@Component({
  selector: 'app-exercises',
  imports: [CommonModule],
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
  readonly nivelesTotales = 5;
  dificultadNivel: number = 3;
  niveles: number[] = [];
  

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

}



