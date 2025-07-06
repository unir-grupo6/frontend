import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IGoal } from '../interfaces/igoals.interface';

@Injectable({
  providedIn: 'root'
})

export class GoalsService {
  private endpoint: string = 'https://rutina-go-backend.onrender.com/api';
  private httpClient = inject(HttpClient)

  getAllGoals(): Promise<IGoal[]> {
    return lastValueFrom(
      this.httpClient.get<IGoal[]>(`${this.endpoint}/goals`)
    );
  }
}
