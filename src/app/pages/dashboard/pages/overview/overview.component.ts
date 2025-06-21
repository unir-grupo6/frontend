import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-overview',
  imports: [FullCalendarModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: [
      { title: 'Reunión de equipo', date: '2025-06-25', backgroundColor: '#ff9f89', borderColor: '#ff9f89' },
      { title: 'Deadline entrega', date: '2025-06-27', backgroundColor: '#ff9f89', borderColor: '#ff9f89' }
    ]
  };

  handleDateClick(arg: any) {
    alert('Haz clic en la fecha: ' + arg.dateStr);
  }
}
