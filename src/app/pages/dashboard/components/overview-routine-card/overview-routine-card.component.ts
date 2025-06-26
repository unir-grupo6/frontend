import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview-routine-card',
  imports: [],
  templateUrl: './overview-routine-card.component.html',
  styleUrl: './overview-routine-card.component.css'
})
export class OverviewRoutineCardComponent {
  @Input() name: string = '';
  @Input() type: string = '';
  @Input() duration: number = 0;
  @Input() exercises: number = 0;
  @Input() lastWorkout: string = '';
}
