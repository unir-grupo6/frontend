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
    fecha_inicio_rutina: new FormControl('', Validators.required),
    fecha_fin_rutina: new FormControl('', Validators.required),
    dia_semana: new FormControl(''),
    compartida: new FormControl(''),
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
      nombre: new FormControl(ejercicio.nombre || ''),
      repeticiones: new FormControl(ejercicio.repeticiones || ''),
      series: new FormControl(ejercicio.series || ''),
      comentario: new FormControl(ejercicio.comentario || ''),
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

        // Rellenar solo los campos editables del formulario
        this.routineForm.patchValue({
          fecha_inicio_rutina: this.routine.fecha_inicio_rutina,
          fecha_fin_rutina: this.routine.fecha_fin_rutina,
          dia_semana: this.routine.dia,
          compartida: this.routine.rutina_compartida,
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

  async getDataForm() {
    // Aquí solo se enviarían los campos editables:
    // - fecha_inicio_rutina
    // - fecha_fin_rutina
    // - dia_semana
    // - compartida
    // - ejercicios (solo series, repeticiones y comentario)

    const formData = this.routineForm.value;
    console.log('Datos del formulario:', formData);

    // Procesar solo los campos editables de los ejercicios
    const ejerciciosEditables = formData.ejercicios.map((ej: any) => ({
      // Mantener el ID del ejercicio si existe
      id: ej.id,
      series: ej.series,
      repeticiones: ej.repeticiones,
      comentario: ej.comentario,
    }));

    const dataToSend = {
      fecha_inicio_rutina: formData.fecha_inicio_rutina,
      fecha_fin_rutina: formData.fecha_fin_rutina,
      dia_semana: formData.dia_semana,
      compartida: formData.compartida,
      ejercicios: ejerciciosEditables,
    };

    console.log('Datos a enviar:', dataToSend);
  }

  routinesService = inject(RoutinesService);

  async downloadFile(rutina_id: string) {
    const number_id = parseInt(rutina_id)
    const reponse = await this.routinesService.downloadRoutine(number_id);
    console.log('Archivo descargado:', reponse);
    const blob = new Blob([reponse], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rutina_${rutina_id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    console.log('Descarga iniciada para rutina:', rutina_id);
  }
}
