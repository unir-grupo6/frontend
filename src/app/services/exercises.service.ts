import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IExercises } from '../interfaces/iexercises.interface';
import { lastValueFrom } from 'rxjs';
import { IDifficulty } from '../interfaces/idifficulty.interface';
import { IMuscleGroup } from '../interfaces/imuscle-group.interface';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private endpoint: string = 'https://rutina-go-backend.onrender.com/api';
  private httpClient = inject(HttpClient);
  private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token') || '';
  console.log('Token in getAuthHeaders:', token); // <-- Esto te ayudará a comprobar
  return new HttpHeaders().set('Authorization', token);
}
  /**
   * Obtenemos todos los ejercicios
   * getAllExercises
   * @returns  Promise<IExercises[]>
   */
  getAllExercises(): Promise<IExercises[]> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.httpClient.get<IExercises[]>(`${this.endpoint}/exercises`, { headers })
    );
  }



  /**
   * Obtiene ejercicios filtrados por grupo muscular y dificultad
   * @param muscleGroupId ID del grupo muscular
   * @param difficultyId ID de la dificultad
   * @returns Promise<IExercises[]>
   */
  getFilteredExercises(
    muscleGroupId: number,
    difficultyId: number,
  ): Promise<IExercises[]> {
    const params = new HttpParams()
      .set('grupos_musculares_id', muscleGroupId)
      .set('dificultad_id', difficultyId);
    const headers = this.getAuthHeaders();
    const url = `${this.endpoint}/exercises/filter`;

    return lastValueFrom(this.httpClient.get<IExercises[]>(url, { params, headers }));
  }

  getMuscleGroups(): Promise<IMuscleGroup[]> {
  return lastValueFrom(
    this.httpClient.get<IMuscleGroup[]>(`${this.endpoint}/muscle-groups`)
  );
}

getDifficulties(): Promise<IDifficulty[]> {
  return lastValueFrom(
    this.httpClient.get<IDifficulty[]>(`${this.endpoint}/difficulties`)
  );
}
}
