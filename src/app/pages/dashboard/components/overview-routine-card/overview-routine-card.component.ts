import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview-routine-card',
  imports: [RouterLink],
  templateUrl: './overview-routine-card.component.html',
  styleUrl: './overview-routine-card.component.css'
})
export class OverviewRoutineCardComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() type!: string;
  @Input() exercises!: number;
  @Input() lastWorkout!: string;
}