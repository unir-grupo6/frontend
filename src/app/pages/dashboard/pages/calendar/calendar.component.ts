import { Component, inject, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { IRoutine } from '../../../../interfaces/iroutine.interface';
import { RoutinesService } from '../../../../services/routines.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  routines: IRoutine[] = [];
  routinesService = inject(RoutinesService);
  router = inject(Router);
  routineEvents: any[] = [];

  async ngOnInit() {
    try {
      const userData = await this.routinesService.getUserRoutines();
      this.routines = userData.rutinas;

      console.log('Todas las rutinas:', this.routines);

      // Generar eventos recurrentes para todas las rutinas (para el calendario)
      this.routineEvents = this.generateRecurringEvents(this.routines);

      // Asigna los eventos al calendario
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.routineEvents,
      };
    } catch (error) {
      console.error('Error al cargar las rutinas:', error);
    }
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

  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth', // Vista inicial del calendario
    height: 750,

    headerToolbar: {
      right: 'prev,next',
      center: 'title',
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
    },

    buttonText: {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
    },

    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),

    editable: true,

    events: [],

    // Estilo visual opcional
    eventDisplay: 'block',
    dayMaxEvents: true, // "Más eventos..." si hay muchos en un mismo día

    // Personalización de títulos
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
  };

  /**
   * Maneja el evento de clic en un evento del calendario
   * Redirige a la página de edición de la rutina correspondiente
   * @param info Información del evento clicado
   */
  handleEventClick(info: any) {
    const id = info.event.id;
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

    // Suponemos que estas fechas vienen como strings en formato "dd-MM-yyyy"
    const fechaInicioStr = info.event.extendedProps.fechaInicio;
    const fechaFinStr =
      info.event.extendedProps.rutinaCompleta.fecha_fin_rutina;

    // Utilidad para convertir "dd-MM-yyyy" a Date
    const parseBackendDate = (dateStr: string): Date => {
      const [dia, mes, año] = dateStr.split('-').map(Number);
      return new Date(año, mes - 1, dia); // JS usa meses de 0 a 11
    };

    const fechaInicio = parseBackendDate(fechaInicioStr);
    const fechaFin = parseBackendDate(fechaFinStr);

    // Calcular el nuevo día de la semana basado en la nueva fecha
    const nuevoDiaJS = nuevaFecha.getDay(); // 0=domingo, 1=lunes, etc.
    const nuevoDiaBackend = nuevoDiaJS === 0 ? 7 : nuevoDiaJS;

    console.log(
      'Nueva fecha: ',
      nuevaFecha,
      ' - Fecha Inicio: ',
      fechaInicio,
      ' - Fecha Fin: ',
      fechaFin
    );

    if (nuevaFecha < fechaInicio || nuevaFecha > fechaFin) {
      toast.error(
        'La fecha seleccionada está fuera del rango de fecha establecido para esta rutina.'
      );
      info.revert();
      return;
    }

    try {
      await this.routinesService.updateRoutine(
        rutinaId,
        fechaInicioStr,
        fechaFinStr,
        undefined,
        nuevoDiaBackend
      );

      const userData = await this.routinesService.getUserRoutines();
      this.routines = userData.rutinas;
      this.routineEvents = this.generateRecurringEvents(this.routines);

      // Refrescar el calendario
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(this.routineEvents);
    } catch (error) {
      console.error('Error al actualizar el día de la rutina:', error);
      info.revert();
    }
  }

  /**
   * Convierte un objeto Date al formato "dd-MM-yyyy"
   * @param date Objeto Date
   * @returns Fecha en formato "dd-MM-yyyy"
   */
  private formatDateToBackend(date: Date): string {
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}-${mes}-${año}`;
  }
}
