import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IExercises } from '../interfaces/iexercises.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private endpoint: string = "https://rutina-go-backend.onrender.com/api/exercises";
  private httpClient = inject(HttpClient);


/**
 * Obtenemos todos los ejercicios
 * getAllExercises
 * @returns  Promise<IExercises[]>
 */
  getAllExercises() : Promise<IExercises[]> {
    return lastValueFrom(this.httpClient.get<IExercises[]>(this.endpoint))}

 
/**
* Obtiene ejercicios filtrados por grupo muscular y dificultad
* @param muscleGroupId ID del grupo muscular
* @param difficultyId ID de la dificultad
   * @returns Promise<IExercises[]>
   */
  getFilteredExercises(muscleGroupId: number, difficultyId: number): Promise<IExercises[]> {
    const params = new HttpParams()
      .set('grupos_musculares_id', muscleGroupId)
      .set('dificultad_id', difficultyId);

    const url = `${this.endpoint}/filter`;

    return lastValueFrom(this.httpClient.get<IExercises[]>(url, { params }));
  }
}


//falta getExerciseBymuscleAndDifficulty