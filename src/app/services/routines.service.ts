import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserWithRoutines } from '../interfaces/iuser-with-routines.interface';
import { lastValueFrom } from 'rxjs';
import { IPublicRoutine } from '../interfaces/ipublic-routine.interface';
import { IRoutine } from '../interfaces/iroutine.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutinesService {
  private endpoint: string =
    'https://rutina-go-backend.onrender.com/api/user-routines';

  private routinesEndpoint: string =
    'https://rutina-go-backend.onrender.com/api/routines';

  private httpClient = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // o donde tengas el token guardado
    return new HttpHeaders().set('Authorization', token);
  }

  getUserRoutines(
    page: number = 1,
    limit: number = 100
  ): Promise<IUserWithRoutines> {
    const url = `${this.endpoint}?page=${page}&limit=${limit}`;

    return lastValueFrom(
      this.httpClient.get<IUserWithRoutines>(url, {
        headers: this.getAuthHeaders(),
      })
    );
  }

  getUserRoutineById(id: number): Promise<IRoutine> {
    return lastValueFrom(
      this.httpClient.get<IRoutine>(`${this.endpoint}/${id}`, {
        headers: this.getAuthHeaders(),
      })
    );
  }

  updateRoutineDay(
    id: number,
    fecha_inicio: string,
    fecha_fin: string,
    dia: number
  ): Promise<IUserWithRoutines> {
    return lastValueFrom(
      this.httpClient.patch<IUserWithRoutines>(
        `${this.endpoint}/${id}`,
        {
          fecha_inicio_rutina: fecha_inicio,
          fecha_fin_rutina: fecha_fin,
          dia: dia,
        },
        { headers: this.getAuthHeaders() }
      )
    );
  }

  updateRoutineDate(
    id: number,
    fecha_inicio: string,
    fecha_editada: string
  ): Promise<IUserWithRoutines> {
    return lastValueFrom(
      this.httpClient.patch<IUserWithRoutines>(
        `${this.endpoint}/${id}`,
        { fecha_fin_rutina: fecha_editada, fecha_inicio_rutina: fecha_inicio },
        { headers: this.getAuthHeaders() }
      )
    );
  }

  getSharedRoutines(): Promise<IPublicRoutine[]> {
    const url = `${this.routinesEndpoint}/shared`;

    return lastValueFrom(
      this.httpClient.get<IPublicRoutine[]>(url, {
        headers: this.getAuthHeaders(),
      })
    );
  }

  savePublicRoutine(rutina_id: number): Promise<IRoutine> {
    return lastValueFrom(
      this.httpClient.post<IRoutine>(
        `${this.endpoint}/${rutina_id}/save`,
        {},
        { headers: this.getAuthHeaders() }
      )
    );
  }

  downloadRoutine(routineId: number): Promise<Blob> {
    const url = `${this.endpoint}/generate/${routineId}`;
    return lastValueFrom(
      this.httpClient.get(url, {
        headers: this.getAuthHeaders(),
        responseType: 'blob',
      })
    );
  }
}
