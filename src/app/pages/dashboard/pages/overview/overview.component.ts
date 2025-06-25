import { Component, HostListener } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-overview',
  imports: [FullCalendarModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'weekGrid', // Cambiamos la vista inicial a la personalizada
    locale: esLocale, 
    height: this.getCalendarHeight(),
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: [
      {
        title: 'Reunión de equipo',
        date: '2025-06-25',
        backgroundColor: '#ff9f89',
        borderColor: '#ff9f89',
      },
      {
        title: 'Deadline entrega',
        date: '2025-06-27',
        backgroundColor: '#ff9f89',
        borderColor: '#ff9f89',
      },
    ],
    headerToolbar: {
      right: 'prev,next',
    },
    views: {
      weekGrid: {
        type: 'dayGrid',
        duration: { days: 7 },
        buttonText: 'Semana',
      },
    },
    visibleRange: (currentDate) => {
      const start = new Date(currentDate.valueOf());
      const end = new Date(currentDate.valueOf());
      start.setDate(start.getDate() - start.getDay()); // Lunes
      end.setDate(start.getDate() + 6); // Domingo
      return { start, end };
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
