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
import { IExercises } from '../../../../interfaces/iexercises.interface';

@Component({
  selector: 'app-routine-form',
  imports: [ReactiveFormsModule],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.css',
})
export class RoutineFormComponent {
  @Input() id: string = '';

  routine!: IRoutine;
  exercises!: IExercises[]; 
  routineService = inject(RoutinesService);
  title: string = 'Crear Rutina';
  description: string = 'Crea tu rutina de entrenamiento personalizada';

  routineForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    rutina_observaciones: new FormControl(''),
    nivel: new FormControl('', []),
    metodo_nombre: new FormControl(''),
    metodo_observaciones: new FormControl(''),
    fecha_inicio_rutina: new FormControl('', Validators.required),
    fecha_fin_rutina: new FormControl('', Validators.required),
    activa: new FormControl(false),
    ejercicios: new FormArray([]),
  });

  get ejercicios(): FormArray {
    return this.routineForm.get('ejercicios') as FormArray;
  }

  get ejerciciosControls() {
    return this.ejercicios.controls;
  }

  createEjercicioGroup(ejercicio: any): FormGroup {
    return new FormGroup({
      nombre: new FormControl(ejercicio.nombre || '', Validators.required),
      repeticiones: new FormControl(ejercicio.repeticiones || ''),
      series: new FormControl(ejercicio.series || ''),
      peso: new FormControl(ejercicio.peso || ''),
    });
  }

  // si se recibe el id de usuario, llamar al servicio para obtener los datos del usuario y pintarlos
  // dentro del formulario, si no se recibe, recoger los datos del form e insertarlos mediante el servicio
  async ngOnInit() {
    if (this.id) {
      this.title = 'Editar Rutina';
      this.description = 'Edita tu rutina de entrenamiento personalizada';

      try {
        this.routine = await this.routineService.getUserRoutineById(
          parseInt(this.id)
        );
        console.log('Rutina obtenida:', this.routine);

        // Rellenar los campos del formulario
        this.routineForm.patchValue({
          nombre: this.routine.nombre,
          rutina_observaciones: this.routine.rutina_observaciones,
          nivel: this.routine.nivel,
          metodo_nombre: this.routine.metodo_nombre,
          metodo_observaciones: this.routine.metodo_observaciones,
          fecha_inicio_rutina: this.routine.fecha_inicio_rutina,
          fecha_fin_rutina: this.routine.fecha_fin_rutina,
          activa: this.routine.rutina_activa,
        });

        // Limpiar ejercicios anteriores (por si acaso)
        this.ejercicios.clear();

        // Añadir ejercicios
        this.routine.ejercicios.forEach((ej) => {
          this.ejercicios.push(this.createEjercicioGroup(ej));
        });
      } catch (error) {
        console.error('Error al obtener la rutina:', error);
      }
    }
  }

  async getDataForm() {}
}