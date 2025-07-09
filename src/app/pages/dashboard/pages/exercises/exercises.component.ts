import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card.component';
import { IExercises } from '../../../../interfaces/iexercises.interface';
import { ExercisesService } from '../../../../services/exercises.service';
import { IDifficulty } from '../../../../interfaces/idifficulty.interface';
import { IMuscleGroup } from '../../../../interfaces/imuscle-group.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-exercises',
  imports: [CommonModule, DashboardCardComponent, FormsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css',
})
export class ExercisesComponent {
  //el array de ejercicios
  arrExercises: IExercises[] = [];
  exercisesService = inject(ExercisesService);

  difficulties: IDifficulty[] = [];
  muscleGroups: IMuscleGroup[] = [];

  selectedDifficulty: string = '';
  selectedMuscleGroup: string = '';

  @ViewChild('muscleDropdown', { static: false }) muscleDropdown!: ElementRef;
  @ViewChild('difficultyDropdown', { static: false })
  difficultyDropdown!: ElementRef;

  //Traer los ejercicios del servicio
  async ngOnInit() {
    try {
      this.arrExercises = await this.exercisesService.getAllExercises();
      this.filteredExercises = [...this.arrExercises];

      this.difficulties = await this.exercisesService.getDifficulties();
      this.muscleGroups = await this.exercisesService.getMuscleGroups();

    } catch (error) {
      toast.error('Error al cargar los ejercicios. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  applyFilters() {
    this.currentPage = 1;

    this.filteredExercises = this.arrExercises.filter((ex) => {
      const matchesName = ex.nombre
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesDifficulty = this.selectedDifficulty
        ? ex.dificultad_id.toString() === this.selectedDifficulty
        : true;
      const matchesMuscleGroup = this.selectedMuscleGroup
        ? ex.grupos_musculares_id.toString() === this.selectedMuscleGroup
        : true;

      return matchesName && matchesDifficulty && matchesMuscleGroup;
    });
  }

  showMuscleDropdown = false;
  showDifficultyDropdown = false;

  selectMuscleGroup(id: string) {
    this.selectedMuscleGroup = id;
    this.applyFilters();
    this.showMuscleDropdown = false;
  }

  selectDifficulty(id: string) {
    this.selectedDifficulty = id;
    this.applyFilters();
    this.showDifficultyDropdown = false;
  }

  getMuscleGroupName(id: string): string | null {
    return (
      this.muscleGroups.find((g) => g.id.toString() === id)?.nombre ?? null
    );
  }

  getDifficultyName(id: string): string | null {
    return this.difficulties.find((d) => d.id.toString() === id)?.nivel ?? null;
  }

  //paginación
  currentPage: number = 1;
  exercicesPerPage: number = 5;
  get paginatedExercises(): IExercises[] {
    const startIndex = (this.currentPage - 1) * this.exercicesPerPage;
    const endIndex = startIndex + this.exercicesPerPage;
    return this.filteredExercises.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredExercises.length / this.exercicesPerPage);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  //Buscador
  searchTerm: string = '';
  filteredExercises: IExercises[] = [];

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      this.showMuscleDropdown &&
      this.muscleDropdown &&
      !this.muscleDropdown.nativeElement.contains(target)
    ) {
      this.showMuscleDropdown = false;
    }

    if (
      this.showDifficultyDropdown &&
      this.difficultyDropdown &&
      !this.difficultyDropdown.nativeElement.contains(target)
    ) {
      this.showDifficultyDropdown = false;
    }
  }
}
