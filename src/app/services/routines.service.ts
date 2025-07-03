import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserWithRoutines } from '../interfaces/iuser-with-routines.interface';
import { lastValueFrom } from 'rxjs';
import { IRoutine } from '../interfaces/iroutine.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutinesService {
  private endpoint: string =
    'https://rutina-go-backend.onrender.com/api/user-routines';
  private httpClient = inject(HttpClient);

  getUserRoutines(
    token: string,
    active: boolean = true,
    page: number = 1,
    limit: number = 10
  ): Promise<IUserWithRoutines> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    const url = `${this.endpoint}?page=${page}&limit=${limit}&active=${active}`;

    return lastValueFrom(
      this.httpClient.get<IUserWithRoutines>(url, { headers })
    );
  }

  getUserRoutineById(token: string, id: number): Promise<IRoutine> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    return lastValueFrom(
      this.httpClient.get<IRoutine>(`${this.endpoint}/${id}`, {
        headers,
      })
    );
  }

  updateRoutineDay(
    token: string,
    id: number,
    fecha_inicio: string,
    fecha_fin: string,
    dia: number
  ): Promise<IUserWithRoutines> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    return lastValueFrom(
      this.httpClient.patch<IUserWithRoutines>(
        `${this.endpoint}/${id}`,
        {
          fecha_inicio_rutina: fecha_inicio,
          fecha_fin_rutina: fecha_fin,
          dia: dia,
        },
        { headers }
      )
    );
  }

  updateRoutineDate(
    token: string,
    id: number,
    fecha_inicio: string,
    fecha_editada: string
  ): Promise<IUserWithRoutines> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    return lastValueFrom(
      this.httpClient.patch<IUserWithRoutines>(
        `${this.endpoint}/${id}`,
        { fecha_fin_rutina: fecha_editada, fecha_inicio_rutina: fecha_inicio },
        { headers }
      )
    );
  }
}
