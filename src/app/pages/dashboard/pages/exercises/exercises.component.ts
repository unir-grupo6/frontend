import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Modal } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { DashboardCardComponent } from "../../components/dashboard-card/dashboard-card.component";
import { IExercises } from '../../../../interfaces/iexercises.interface';
import { ExercisesService } from '../../../../services/exercises.service';

@Component({
  selector: 'app-exercises',
  imports: [CommonModule, DashboardCardComponent, FormsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css'
})
export class ExercisesComponent {

//el array de ejercicios
arrExercises: IExercises[] = [];
exercisesService= inject(ExercisesService);

  async ngOnInit() {
  try {
  this.arrExercises = await this.exercisesService.getAllExercises()
  console.log
}catch (error) {
  console.error('Error ', error);} 
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

  }




