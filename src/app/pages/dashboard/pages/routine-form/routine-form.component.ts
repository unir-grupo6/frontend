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
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { Modal } from 'flowbite';
import { ExercisesService } from '../../../../services/exercises.service';

// Validador personalizado para números mayores que 0
function greaterThanZero(control: any) {
  const value = parseInt(control.value);
  if (isNaN(value) || value <= 0) {
    return { greaterThanZero: true };
  }
  return null;
}

@Component({
  selector: 'app-routine-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.css',
})
export class RoutineFormComponent {
  @Input() id: string = '';

  routine!: IRoutine;
  exercises!: IExercises[];
  routineService = inject(RoutinesService);
  router = inject(Router);
  title: string = 'Crear Rutina';
  description: string = 'Crea tu rutina de entrenamiento personalizada';

  routineForm: FormGroup = new FormGroup({
    fecha_inicio_rutina: new FormControl('', Validators.required),
    fecha_fin_rutina: new FormControl('', Validators.required),
    dia_semana: new FormControl('', Validators.required),
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
      ejercicio_id: new FormControl(ejercicio.ejercicio_id || null),
      nombre: new FormControl(ejercicio.nombre || ''),
      repeticiones: new FormControl(ejercicio.repeticiones || '', [
        Validators.required,
        greaterThanZero
      ]),
      series: new FormControl(ejercicio.series || '', [
        Validators.required,
        greaterThanZero
      ]),
      comentario: new FormControl(ejercicio.comentario || ''),
      orden: new FormControl(ejercicio.orden || 1),
    });
  }

  // Método para verificar si un campo específico de un ejercicio tiene errores
  hasExerciseFieldError(exerciseIndex: number, fieldName: string): boolean {
    const exerciseControl = this.ejercicios.at(exerciseIndex);
    const fieldControl = exerciseControl.get(fieldName);
    return fieldControl ? fieldControl.invalid && fieldControl.touched : false;
  }

  // Método para obtener el mensaje de error específico
  getExerciseFieldErrorMessage(exerciseIndex: number, fieldName: string): string {
    const exerciseControl = this.ejercicios.at(exerciseIndex);
    const fieldControl = exerciseControl.get(fieldName);
    
    if (fieldControl?.errors?.['required']) {
      return `${fieldName} es requerido`;
    }
    if (fieldControl?.errors?.['greaterThanZero']) {
      return `${fieldName} debe ser mayor que 0`;
    }
    return '';
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

        // Convertir día numérico a texto
        const diasSemana = [
          '',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
          'Domingo',
        ];
        const diaTexto = diasSemana[this.routine.dia]; // si `dia` es 1-7

        // Convertir fecha al formato YYYY-MM-DD
        const formatFecha = (fecha: string): string => {
          if (!fecha) return '';
          const [dd, mm, yyyy] = fecha.split('-');
          return `${yyyy}-${mm}-${dd}`;
        };

        // Rellenar solo los campos editables del formulario
        this.routineForm.patchValue({
          fecha_inicio_rutina: formatFecha(this.routine.fecha_inicio_rutina),
          fecha_fin_rutina: formatFecha(this.routine.fecha_fin_rutina),
          dia_semana: diaTexto,
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
    const formData = this.routineForm.value;

    // Validar series y repeticiones antes de procesar
    let hasInvalidExercises = false;
    
    for (let i = 0; i < formData.ejercicios.length; i++) {
      const ejercicio = formData.ejercicios[i];
      const series = parseInt(ejercicio.series);
      const repeticiones = parseInt(ejercicio.repeticiones);
      
      if (isNaN(series) || series <= 0) {
        toast.error(`Las series del ejercicio ${i + 1} deben ser mayor que 0.`);
        hasInvalidExercises = true;
      }
      
      if (isNaN(repeticiones) || repeticiones <= 0) {
        toast.error(`Las repeticiones del ejercicio ${i + 1} deben ser mayor que 0.`);
        hasInvalidExercises = true;
      }
    }

    if (hasInvalidExercises) {
      return; // Detener la ejecución si hay ejercicios inválidos
    }

    // Función para convertir la fecha al formato dd/mm/yyyy
    const formatDate = (isoDate: string): string => {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Mapa para convertir el nombre del día al número (1 = lunes, ..., 7 = domingo)
    const diasSemanaMap: { [key: string]: number } = {
      '': 0, // Opción por defecto
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      domingo: 7,
    };

    // Convertir día de la semana al número correspondiente
    const diaSemanaNumero = diasSemanaMap[formData.dia_semana.toLowerCase()];

    // Procesar solo los campos editables de los ejercicios
    const ejerciciosEditables = formData.ejercicios.map((ej: any) => ({
      // Mantener el ID del ejercicio si existe
      id: ej.ejercicio_id,
      series: ej.series,
      repeticiones: ej.repeticiones,
      comentario: ej.comentario,
      orden: ej.orden,
    }));

    const routineData = {
      id: parseInt(this.id),
      fecha_inicio_rutina: formatDate(formData.fecha_inicio_rutina),
      fecha_fin_rutina: formatDate(formData.fecha_fin_rutina),
      dia_semana: diaSemanaNumero,
      compartida: formData.compartida,
    };

    const exerciseData = {
      ejercicios: ejerciciosEditables,
    };

    console.log('Datos a enviar (rutina):', routineData);
    console.log('Datos a enviar (ejercicios):', exerciseData);

    // Actualizar rutina en el backend
    if (this.routineForm.invalid) {
      toast.error('Por favor, complete todos los campos requeridos.');
      return; // Detener la ejecución si el formulario no es válido
    } else {
      try {
        await this.routineService.updateRoutine(
          routineData.id,
          routineData.fecha_inicio_rutina,
          routineData.fecha_fin_rutina,
          routineData.compartida,
          routineData.dia_semana
        );
        toast.success('Rutina actualizada correctamente.');
        // navegar a dashboard/routines
        // this.router.navigate(['/dashboard/routines']);
      } catch (error) {
        console.error('Error al actualizar la rutina:', error);
        toast.error('Error al actualizar la rutina.');
      }

      // Actualizar ejercicios de la rutina en el backend
      try {
        const ejerciciosPromises = formData.ejercicios.map((ejercicio: any) => {
          if (ejercicio.ejercicio_id) {
            return this.routineService.updateRoutineExercise(
              parseInt(this.id), // routineId
              ejercicio.ejercicio_id, // exerciseId
              parseInt(ejercicio.series),
              parseInt(ejercicio.repeticiones),
              parseInt(ejercicio.orden),
              ejercicio.comentario
            );
          }
          return Promise.resolve(); // Si no hay ID, no hacer nada
        });

        // Ejecutar todas las promesas de actualización de ejercicios
        await Promise.all(ejerciciosPromises);
        toast.success('Ejercicios actualizados correctamente.');

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // Navegar al dashboard después de que todo esté actualizado
        // this.router.navigate(['/dashboard/routines']);
      } catch (error) {
        console.error(
          'Error al actualizar los ejercicios de la rutina:',
          error
        );
        toast.error('Error al actualizar los ejercicios de la rutina.');
      }
    }
  }

  routinesService = inject(RoutinesService);

  async downloadFile(rutina_id: string) {
    const number_id = parseInt(rutina_id);
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

  addExerciseModal!: Modal;
  private lastFocusedElement: HTMLElement | null = null;
  exercisesService = inject(ExercisesService);
  arrExercises: IExercises[] = [];

  async ngAfterViewInit() {
    const addExerciseModal = document.getElementById('addExerciseModal');
    if (addExerciseModal) {
      this.addExerciseModal = new Modal(addExerciseModal, {
        placement: 'center',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
        closable: true,
      });
    }

    this.arrExercises = await this.exercisesService.getAllExercises();
  }

  openAddExerciseModal() {
    this.lastFocusedElement = document.activeElement as HTMLElement;
    this.addExerciseModal?.show();

    const addExerciseModal = document.getElementById('addExerciseModal');
    if (addExerciseModal) {
      const closeBtn = addExerciseModal.querySelector(
        'button[aria-label="Cerrar modal"]'
      ) as HTMLElement;
      if (closeBtn) {
        closeBtn.focus();
      }
    }
    if (addExerciseModal) {
      addExerciseModal.classList.remove('hidden');
      addExerciseModal.classList.add('block');
    } else {
      console.error('addExerciseModal not found');
    }
  }

  closeAddExerciseModal() {
    this.addExerciseModal?.hide();
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }

  async addExerciseToRoutine() {
    const selectedExercise = (
      document.getElementById('dropDownExercises') as HTMLSelectElement
    ).value;

    console.log('Ejercicio seleccionado:', selectedExercise);

    if (!selectedExercise) {
      toast.error('Por favor, selecciona un ejercicio.');
      return;
    }

    try {
      const response = await this.routineService.addExerciseToRoutine(
        this.routine.rutina_id,
        parseInt(selectedExercise),
        // this.ejercicios.length + 1
      );

      if (
        response &&
        typeof response === 'object' &&
        'rutina_id' in response &&
        'ejercicios' in response
      ) {
        this.routine = response;
        this.ejercicios.push(
          this.createEjercicioGroup({
            nombre:
              this.arrExercises.find(
                (ex) => ex.id === parseInt(selectedExercise)
              )?.nombre || '',
            repeticiones: '',
            series: '',
            comentario: '',
          })
        );
        toast.success('Ejercicio añadido a la rutina correctamente.');
        this.addExerciseModal?.hide();
      } else {
        toast.error('La respuesta del servidor no es válida.');
      }
    } catch (error) {
      toast.error('Error al añadir el ejercicio a la rutina.');
    }
  }

  async deleteExercise(exerciseIndex: number) {
    try {
      // Obtener el ID del ejercicio desde el FormArray
      const exerciseControl = this.ejercicios.at(exerciseIndex);
      const ejercicioId = exerciseControl.get('ejercicio_id')?.value;

      // El ID de la rutina ya lo tienes disponible
      const rutinaId = this.routine.rutina_id;

      console.log('ID de la rutina:', rutinaId);
      console.log('ID del ejercicio:', ejercicioId);

      if (!ejercicioId) {
        toast.error('No se puede eliminar el ejercicio: ID no encontrado.');
        return;
      }

      // Llamar al servicio para eliminar el ejercicio
      await this.routineService.deleteExerciseFromRoutine(
        rutinaId,
        ejercicioId
      );

      // Eliminar el ejercicio del FormArray
      this.ejercicios.removeAt(exerciseIndex);

      toast.success('Ejercicio eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el ejercicio:', error);
      toast.error('Error al eliminar el ejercicio.');
    }
  }
}