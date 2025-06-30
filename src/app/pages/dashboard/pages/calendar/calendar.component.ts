import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    height: 750,
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
}