import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IGoals } from '../interfaces/igoals.interface';

@Injectable({
  providedIn: 'root'
})

export class GoalsService {
  private endpoint: string = 'https://rutina-go-backend.onrender.com/api';
  private httpClient = inject(HttpClient)

  getAllGoals(): Promise<IGoals[]> {
    return lastValueFrom(
      this.httpClient.get<IGoals[]>(`${this.endpoint}/goals`)
    );
  }
}
