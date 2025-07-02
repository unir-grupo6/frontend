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
  routines: IRoutine[] = [];
  routinesService = inject(RoutinesService);
  router = inject(Router);

  token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTE0NDU3NTQsImlhdCI6MTc1MTQ0Mzk1NH0.H8yoZkt26vUixL9TPGgL7N2wtdEcwNuuluIvkn8BpL0';

  async ngOnInit() {
    try {
      // const token = localStorage.getItem('token') ?? '';
      const userData = await this.routinesService.getUserRoutines(this.token);
      this.routines = userData.rutinas;

      // Mapea rutinas a eventos
      const rutinaEvents = this.routines
        .filter((r) => !!r.fecha_fin_rutina)
        .map((r) => ({
          title: r.nombre,
          date: this.convertirFecha(r.fecha_fin_rutina), // Convierte la fecha al formato necesario para FullCalendar
          backgroundColor: '#F05A19',
          borderColor: '#F05A19',
          id: r.rutina_id.toString(),
          extendedProps: {
            fechaInicio: r.fecha_inicio_rutina,
          },
        }));

      console.log(rutinaEvents);

      // Asigna los eventos al calendario
      this.calendarOptions = {
        ...this.calendarOptions,
        events: rutinaEvents,
      };
    } catch (error) {
      console.error('Error al cargar las rutinas:', error);
    }
  }

  /**
   * Convierte una fecha del formato "dd-MM-yyyy" a "yyyy-MM-dd"
   * @param fecha Fecha en formato "dd-MM-yyyy"
   * @returns Fecha en formato "yyyy-MM-dd"
   */
  private convertirFecha(fecha: string): string {
    const [dia, mes, año] = fecha.split('-');
    return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  get totalEjercicios(): number {
    return this.routines.reduce((acc, r) => acc + r.ejercicios.length, 0);
  }

  get rutinasActivas(): number {
    return this.routines.filter((r) => r.rutina_activa).length;
  }

  get fechaUltimoEntrenamiento(): string {
    // Filtrar rutinas que tengan fecha_fin_rutina válida
    const rutinasConFecha = this.routines.filter(
      (r) => r.fecha_fin_rutina !== null && r.fecha_fin_rutina !== undefined
    );

    if (rutinasConFecha.length === 0) {
      return 'N/A';
    }

    // Convertir fechas del formato dd-MM-yyyy a Date
    const fechas = rutinasConFecha.map((r) => {
      const fechaStr = r.fecha_fin_rutina;
      // Dividir la fecha dd-MM-yyyy
      const [dia, mes, año] = fechaStr.split('-');
      // Crear Date con formato correcto (año, mes-1, día)
      return new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
    });

    // Encontrar la fecha más reciente
    const ultima = fechas.reduce((a, b) => (a > b ? a : b));

    // Formatear la fecha
    return ultima.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get tiposRutina(): string[] {
    return [...new Set(this.routines.map((r) => r.nivel?.toLowerCase()))];
  }

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

  handleEventClick(info: any) {
    const id = info.event.id;
    console.log('Evento clicado:', info.event.title, 'ID:', id);
    if (id) {
      this.router.navigate(['/dashboard/routines/edit', id]);
    }
  }

  async handleEventDrop(info: any) {
    const rutinaId = info.event.id;
    const nuevaFecha = info.event.start; // objeto Date
    const fechaInicio = info.event.extendedProps.fechaInicio; // fecha de inicio (necesaria para el backend)

    // Formatea la nueva fecha a "dd-MM-yyyy" (para guardar en tu backend)
    const dia = nuevaFecha.getDate().toString().padStart(2, '0');
    const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
    const año = nuevaFecha.getFullYear();
    const fechaFormateada = `${dia}-${mes}-${año}`;

    console.log('Nueva fecha para rutina', rutinaId, ':', fechaFormateada, 'Fecha de inicio:', fechaInicio);

    try {
      // Aquí llamarías al backend para actualizar la fecha
      await this.routinesService.updateRoutineDate(this.token, rutinaId, fechaInicio, fechaFormateada);
      console.log('Fecha actualizada para rutina', rutinaId);
    } catch (error) {
      console.error('Error al actualizar la fecha:', error);
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

  private getCalendarHeight(): number {
    return window.innerWidth <= 768 ? 250 : 150;
  }
}
