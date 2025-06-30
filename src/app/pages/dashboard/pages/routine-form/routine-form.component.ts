import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IRoutine } from '../../../../interfaces/iroutine.interface';
import { RoutinesService } from '../../../../services/routines.service';

@Component({
  selector: 'app-routine-form',
  imports: [ReactiveFormsModule],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.css',
})
export class RoutineFormComponent {
  @Input() id: string = '';

  routine!: IRoutine;
  routineService = inject(RoutinesService);
  title: string = 'Crear Rutina';
  description: string = 'Crea tu rutina de entrenamiento personalizada';

  routineForm: FormGroup = new FormGroup({
    categoria: new FormControl('', []),
    dificultad: new FormControl('', [])
  });

  // si se recibe el id de usuario, llamar al servicio para obtener los datos del usuario y pintarlos
  // dentro del formulario, si no se recibe, recoger los datos del form e insertarlos mediante el servicio
  async ngOnInit() {
    if (this.id) {
      this.title = 'Editar Rutina';
      this.description = 'Edita tu rutina de entrenamiento personalizada';
    }
  }

  async getDataForm() {}
}
