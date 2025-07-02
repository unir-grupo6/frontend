import { Component } from '@angular/core';

@Component({
  selector: 'app-discover-routines-card',
  imports: [],
  templateUrl: './discover-routines-card.component.html',
  styleUrl: './discover-routines-card.component.css'
})
export class DiscoverRoutinesCardComponent {
isToggleOn = false;

togglePersonalized(event: Event) {
  const input = event.target as HTMLInputElement;
  this.isToggleOn = input.checked;
}

}
