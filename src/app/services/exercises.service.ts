import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IExercises } from '../interfaces/iexercises.interface';
import { last, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private endpoint: string = "https://rutina-go-backend.onrender.com/api";
  private httpClient = inject(HttpClient);

  getAllExercises() : Promise<IExercises[]> {
    return lastValueFrom(this.httpClient.get<IExercises[]>(`${this.endpoint}/exercises`))}
}
