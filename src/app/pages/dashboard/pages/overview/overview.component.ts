import { Component, HostListener, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { OverviewRoutineCardComponent } from '../../components/overview-routine-card/overview-routine-card.component';
import { Router, RouterLink } from '@angular/router';
import { IRoutine } from '../../../../interfaces/iroutine.interface';
import { RoutinesService } from '../../../../services/routines.service';

@Component({
  selector: 'app-overview',
  imports: [FullCalendarModule, OverviewRoutineCardComponent, RouterLink],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
  routines: IRoutine[] = []; // Todas las rutinas del usuario
  displayedRoutines: IRoutine[] = []; // Rutinas que se muestran en el overview
  routinesService = inject(RoutinesService);
  rutinaEvents: any[] = []; // Eventos recurrentes para el calendario
  fechaUltimoEntrenamiento: string | null = null; // Fecha del último entrenamiento
  router = inject(Router);

  async ngOnInit() {
    try {
      const userData = await this.routinesService.getUserRoutines();
      this.routines = userData.rutinas;

      // Seleccionar rutinas inteligentes para mostrar
      this.displayedRoutines = this.getSmartRoutinesForOverview(this.routines);

      console.log('Todas las rutinas:', this.routines);
      console.log('Rutinas mostradas en overview:', this.displayedRoutines);

      // Generar eventos recurrentes para todas las rutinas (para el calendario)
      this.rutinaEvents = this.generateRecurringEvents(this.routines);

      // Asigna los eventos al calendario
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.rutinaEvents,
      };

      this.fechaUltimoEntrenamiento = this.calcularFechaUltimoEntrenamiento(); // Calcular la fecha del último entrenamiento
    } catch (error) {
      console.error('Error al cargar las rutinas:', error);
    }
  }

  /**
   * Selecciona las rutinas más relevantes para mostrar en el overview
   * Prioriza rutinas de esta semana, luego activas, luego más recientes
   * @param allRoutines Todas las rutinas del usuario
   * @returns Array de rutinas seleccionadas (máximo 4)
   */
  private getSmartRoutinesForOverview(allRoutines: IRoutine[]): IRoutine[] {
    const MAX_ROUTINES = 4;
    const hoy = new Date();
    const inicioSemana = this.getStartOfWeek(hoy);
    const finSemana = this.getEndOfWeek(hoy);

    // 1. Rutinas de esta semana (tienen fechas y están en el rango)
    const rutinasEstaSemana = allRoutines.filter((rutina) => {
      if (!rutina.fecha_inicio_rutina || !rutina.fecha_fin_rutina) {
        return false;
      }

      const fechaInicio = this.parseDate(rutina.fecha_inicio_rutina);
      const fechaFin = this.parseDate(rutina.fecha_fin_rutina);

      // Verificar si la rutina tiene actividad en esta semana
      return fechaInicio <= finSemana && fechaFin >= inicioSemana;
    });

    // 2. Rutinas activas (como fallback)
    const rutinasActivas = allRoutines.filter((rutina) => rutina.rutina_activa);

    // 3. Rutinas más recientes (como último recurso)
    const rutinasConFecha = allRoutines
      .filter((rutina) => rutina.fecha_inicio_rutina && rutina.fecha_fin_rutina)
      .sort((a, b) => {
        const fechaA = this.parseDate(a.fecha_inicio_rutina!);
        const fechaB = this.parseDate(b.fecha_inicio_rutina!);
        return fechaB.getTime() - fechaA.getTime(); // Más recientes primero
      });

    // Estrategia de selección
    let selectedRoutines: IRoutine[] = [];

    // Prioridad 1: Rutinas de esta semana
    if (rutinasEstaSemana.length > 0) {
      selectedRoutines = rutinasEstaSemana.slice(0, MAX_ROUTINES);
      console.log(
        `Mostrando ${selectedRoutines.length} rutinas de esta semana`
      );
    }
    // Prioridad 2: Si no hay rutinas de esta semana, mostrar rutinas activas
    else if (rutinasActivas.length > 0) {
      selectedRoutines = rutinasActivas.slice(0, MAX_ROUTINES);
      console.log(
        `Mostrando ${selectedRoutines.length} rutinas activas (no hay rutinas esta semana)`
      );
    }
    // Prioridad 3: Si no hay rutinas activas, mostrar las más recientes
    else if (rutinasConFecha.length > 0) {
      selectedRoutines = rutinasConFecha.slice(0, MAX_ROUTINES);
      console.log(
        `Mostrando ${selectedRoutines.length} rutinas más recientes (no hay rutinas activas)`
      );
    }
    // Último recurso: mostrar cualquier rutina
    else {
      selectedRoutines = allRoutines.slice(0, MAX_ROUTINES);
      console.log(
        `Mostrando ${selectedRoutines.length} rutinas aleatorias (no hay rutinas con criterios específicos)`
      );
    }

    return selectedRoutines;
  }

  /**
   * Obtiene el inicio de la semana (lunes) para una fecha dada
   * @param date Fecha de referencia
   * @returns Fecha del lunes de esa semana
   */
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    return new Date(d.setDate(diff));
  }

  /**
   * Obtiene el fin de la semana (domingo) para una fecha dada
   * @param date Fecha de referencia
   * @returns Fecha del domingo de esa semana
   */
  private getEndOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Ajustar para que domingo sea el último día
    return new Date(d.setDate(diff));
  }

  /**
   * Genera eventos recurrentes para las rutinas basado en las fechas de inicio y fin y el día de la semana
   * @param rutinas Array de rutinas
   * @returns Array de eventos para FullCalendar
   */
  private generateRecurringEvents(rutinas: IRoutine[]): any[] {
    const events: any[] = [];

    rutinas.forEach((rutina) => {
      // Solo procesar rutinas que tengan fecha de inicio, fin y día definidos
      if (
        !rutina.fecha_inicio_rutina ||
        !rutina.fecha_fin_rutina ||
        !rutina.dia
      ) {
        return;
      }

      const fechaInicio = this.parseDate(rutina.fecha_inicio_rutina);
      const fechaFin = this.parseDate(rutina.fecha_fin_rutina);
      const diaRutina = rutina.dia; // 1 = lunes, 2 = martes, etc.

      // Generar todas las fechas que coincidan con el día de la semana
      const fechasRutina = this.getFechasEnDiaSemana(
        fechaInicio,
        fechaFin,
        diaRutina
      );

      // Crear un evento para cada fecha
      fechasRutina.forEach((fecha) => {
        events.push({
          title: rutina.nombre,
          date: this.formatDateForFullCalendar(fecha),
          backgroundColor: '#F05A19',
          borderColor: '#F05A19',
          id: rutina.rutina_id.toString(),
          extendedProps: {
            fechaInicio: rutina.fecha_inicio_rutina,
            fechaOriginal: fecha,
            diaRutina: rutina.dia,
            rutinaCompleta: rutina,
          },
        });
      });
    });
    return events;
  }

  /**
   * Convierte una fecha del formato "dd-MM-yyyy" a objeto Date
   * @param fechaStr Fecha en formato "dd-MM-yyyy"
   * @returns Objeto Date
   */
  private parseDate(fechaStr: string): Date {
    const [dia, mes, año] = fechaStr.split('-');
    return new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
  }

  /**
   * Formatea una fecha Date para FullCalendar (yyyy-MM-dd)
   * @param fecha Objeto Date
   * @returns Fecha en formato "yyyy-MM-dd"
   */
  private formatDateForFullCalendar(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  /**
   * Obtiene todas las fechas entre dos fechas que caigan en un día específico de la semana
   * @param fechaInicio Fecha de inicio
   * @param fechaFin Fecha de fin
   * @param diaRutina Día de la semana (1 = lunes, 2 = martes, etc.)
   * @returns Array de fechas que coinciden con el día de la semana
   */
  private getFechasEnDiaSemana(
    fechaInicio: Date,
    fechaFin: Date,
    diaRutina: number
  ): Date[] {
    const fechas: Date[] = [];
    const fechaActual = new Date(fechaInicio);

    // Ajustar el día de la semana de JavaScript (0 = domingo) al formato backend (1 = lunes)
    // JavaScript: 0=domingo, 1=lunes, 2=martes, etc.
    // Backend: 1=lunes, 2=martes, etc.
    const diaJS = diaRutina === 7 ? 0 : diaRutina; // 7 (domingo en backend) = 0 (domingo en JS)

    // Encontrar la primera fecha que coincida con el día de la semana
    while (fechaActual.getDay() !== diaJS && fechaActual <= fechaFin) {
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // Generar todas las fechas que coincidan con el día de la semana
    while (fechaActual <= fechaFin) {
      fechas.push(new Date(fechaActual));
      fechaActual.setDate(fechaActual.getDate() + 7); // Siguiente semana
    }

    return fechas;
  }

  /** Configuración del calendario */
  calendarOptions: CalendarOptions = {
    initialView: 'weekGrid',
    locale: esLocale,
    height: this.getCalendarHeight(),
    plugins: [dayGridPlugin, interactionPlugin],
    eventClick: this.handleEventClick.bind(this),
    firstDay: 1, // Empezar la semana en lunes
    editable: true,
    eventDrop: this.handleEventDrop.bind(this),
    events: [],
    headerToolbar: {
      right: 'prev,next',
    },
    views: {
      weekGrid: {
        type: 'dayGridWeek',
        buttonText: 'Semana',
      },
    },
  };

  /**
   * Maneja el evento de clic en un evento del calendario
   * Redirige a la página de edición de la rutina correspondiente
   * @param info Información del evento clicado
   */
  handleEventClick(info: any) {
    const id = info.event.id;
    console.log('Evento clicado:', info.event.title, 'ID:', id);
    if (id) {
      this.router.navigate(['/dashboard/routines/edit', id]);
    }
  }

  /**
   * Maneja el evento de arrastre de un evento del calendario
   * Actualiza el día de la rutina en el backend y recarga los eventos
   * @param info Información del evento arrastrado
   */
  async handleEventDrop(info: any) {
    const rutinaId = info.event.id;
    const nuevaFecha = info.event.start; // objeto Date
    const fechaInicio = info.event.extendedProps.fechaInicio;
    const fechaFin = info.event.extendedProps.rutinaCompleta.fecha_fin_rutina;

    // Calcular el nuevo día de la semana basado en la nueva fecha
    const nuevoDiaJS = nuevaFecha.getDay(); // 0=domingo, 1=lunes, etc.
    const nuevoDiaBackend = nuevoDiaJS === 0 ? 7 : nuevoDiaJS; // Convertir a formato backend (1=lunes, 7=domingo)

    console.log(
      'Rutina',
      rutinaId,
      'cambiará al día de la semana:',
      nuevoDiaBackend
    );
    console.log('Fecha inicio:', fechaInicio, 'Fecha fin:', fechaFin);

    try {
      // Actualizar el día de la rutina en el backend
      await this.routinesService.updateRoutineDay(
        rutinaId,
        fechaInicio,
        fechaFin,
        nuevoDiaBackend
      );
      console.log(
        'Día de rutina actualizado para rutina',
        rutinaId,
        'al día:',
        nuevoDiaBackend
      );

      // Recuperar las rutinas actualizadas
      const userData = await this.routinesService.getUserRoutines();
      this.routines = userData.rutinas;
      // Regenerar los eventos con los nuevos datos
      this.rutinaEvents = this.generateRecurringEvents(this.routines);
      this.rutinaEvents = [...this.rutinaEvents];
      // Actualizar fecha del último entrenamiento
      this.fechaUltimoEntrenamiento = this.calcularFechaUltimoEntrenamiento();

      // await this.ngOnInit();
    } catch (error) {
      console.error('Error al actualizar el día de la rutina:', error);
      info.revert(); // revierte el movimiento si algo falla
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calendarOptions = {
      ...this.calendarOptions,
      height: this.getCalendarHeight(),
    };
  }

  // Getters actualizados para usar todas las rutinas, no solo las mostradas
  get totalEjercicios(): number {
    return this.routines.reduce((acc, r) => acc + r.ejercicios.length, 0);
  }

  get rutinasActivas(): number {
    return this.routines.filter((r) => r.rutina_activa).length;
  }

  private calcularFechaUltimoEntrenamiento(): string | null {
    const hoy = new Date();

    const eventosPasados = this.rutinaEvents
      .filter((evento) => {
        const fechaEvento = new Date(evento.date);
        return fechaEvento < hoy;
      })
      .sort((a, b) => {
        const fechaA = new Date(a.date).getTime();
        const fechaB = new Date(b.date).getTime();
        return fechaB - fechaA;
      });

    if (eventosPasados.length === 0) {
      return null;
    }

    const ultimaFecha = new Date(eventosPasados[0].date);
    const dia = ultimaFecha.getDate().toString().padStart(2, '0');
    const mes = (ultimaFecha.getMonth() + 1).toString().padStart(2, '0');
    const año = ultimaFecha.getFullYear();

    return `${dia}-${mes}-${año}`;
  }

  get tiposRutina(): string[] {
    return [...new Set(this.routines.map((r) => r.nivel?.toLowerCase()))];
  }

  private getCalendarHeight(): number {
    return window.innerWidth <= 768 ? 250 : 150;
  }
}
