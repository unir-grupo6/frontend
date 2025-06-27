import { Component, HostListener, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { OverviewRoutineCardComponent } from '../../components/overview-routine-card/overview-routine-card.component';
import { RouterLink } from '@angular/router';
import { IRoutine } from '../../../../interfaces/iroutine.interface';
import { RoutinesService } from '../../../../services/routines.service';

@Component({
  selector: 'app-overview',
  imports: [FullCalendarModule, OverviewRoutineCardComponent, RouterLink],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {

  routines: IRoutine[] = []
  routinesService = inject(RoutinesService)

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token') ?? '';
      const userData = await this.routinesService.getUserRoutines(token);
      this.routines = userData.rutinas;
    } catch (error) {
      console.error("Error al cargar las rutinas:", error);
    }
  }

  calendarOptions: CalendarOptions = {
    initialView: 'weekGrid',
    locale: esLocale,
    height: this.getCalendarHeight(),
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    firstDay: 1, // Empezar la semana en lunes
    events: [
      {
        title: 'Reunión de equipo',
        date: '2025-06-25',
        backgroundColor: '#F05A19',
        borderColor: '#F05A19',
      },
      {
        title: 'Deadline entrega',
        date: '2025-06-27',
        backgroundColor: '#F05A19',
        borderColor: '#F05A19',
      },
    ],
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

  handleDateClick(arg: any) {
    alert('Haz clic en la fecha: ' + arg.dateStr);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calendarOptions = {
      ...this.calendarOptions,
      height: this.getCalendarHeight()
    };
  }

  private getCalendarHeight(): number {
    return window.innerWidth <= 768 ? 250 : 150;
  }
}