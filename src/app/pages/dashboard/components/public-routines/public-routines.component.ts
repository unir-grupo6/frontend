import { Component, inject } from '@angular/core';
import { RoutinesService } from '../../../../services/routines.service';
import { IPublicRoutine } from '../../../../interfaces/ipublic-routine.interface';
import { DetailedPublicRoutineCardComponent } from "../detailed-public-routine-card/detailed-public-routine-card.component";

@Component({
  selector: 'app-public-routines',
  imports: [DetailedPublicRoutineCardComponent],
  templateUrl: './public-routines.component.html',
  styleUrl: './public-routines.component.css'
})
export class PublicRoutinesComponent {

  routinesService = inject(RoutinesService);
  publicRoutines: IPublicRoutine[] = [];

  async ngOnInit() {
    await this.loadRutinas();
  }
  
  async loadRutinas() {
    try {
      this.publicRoutines = await this.routinesService.getSharedRoutines();
      console.log('Rutinas cargadas:', this.publicRoutines);;
    } catch (error) {
      console.error('Error cargando rutinas:', error);
    }
  }

}
