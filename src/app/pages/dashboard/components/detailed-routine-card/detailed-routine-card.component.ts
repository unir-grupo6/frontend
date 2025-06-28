import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detailed-routine-card',
  imports: [RouterLink],
  templateUrl: './detailed-routine-card.component.html',
  styleUrl: './detailed-routine-card.component.css'
})
export class DetailedRoutineCardComponent {
  @Input() rutina: any;
}
