import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserWithRoutines } from '../interfaces/iuser-with-routines.interface'
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutinesService {
  private endpoint: string = 'https://rutina-go-backend.onrender.com/api/users/routines';
  private httpClient = inject(HttpClient)

  getUserRoutines(token: string, active: boolean = true, page: number = 1, limit: number = 10): Promise<IUserWithRoutines> {
    const headers = new HttpHeaders({
      Authorization: token
    });

    const url = `${this.endpoint}?page=${page}&limit=${limit}&active=${active}`;

    return lastValueFrom(
      this.httpClient.get<IUserWithRoutines>(url, { headers })
    );
  }
}