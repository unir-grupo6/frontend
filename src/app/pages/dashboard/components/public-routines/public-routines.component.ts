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

  shownRoutines: IPublicRoutine[] = [];

  currentPage: number = 1;
  pageSize: number = 3;   // Number of routines to show per page

  async ngOnInit() {
    await this.loadRutinas();
  }

  get totalPages(): number {
    return Math.ceil(this.publicRoutines.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateShownRoutines();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateShownRoutines();
    }
  }

  updateShownRoutines() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.shownRoutines = this.publicRoutines.slice(start, end);
  }

  async loadRutinas() {
    try {
      this.publicRoutines = await this.routinesService.getSharedRoutines();
      this.currentPage = 1;
      this.updateShownRoutines();
    } catch (error) {
      console.error('Error cargando rutinas:', error);
    }
  }

}
