import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRoutinesList } from '../interfaces/iroutines-list.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutinesListService {
private baseEndpoint = 'https://rutina-go-backend.onrender.com/api/rutines';
private httpClient = inject(HttpClient);

private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // o donde tengas el token guardado
    return new HttpHeaders().set('Authorization', token);
  }


  /**
   * Obtener todas las rutinas
   */
getRoutinesList(): Promise<IRoutinesList[]> {
    return lastValueFrom(this.httpClient.get<IRoutinesList[]>(this.baseEndpoint, {
      headers: this.getAuthHeaders(),
    }));
  }

/**
   * Obtener una rutina por ID
   * @param id ID de la rutina
   */
getRoutineById(id: number): Promise<IRoutinesList> {
    return lastValueFrom(this.httpClient.get<IRoutinesList>(`${this.baseEndpoint}/${id}`, {
      headers: this.getAuthHeaders(),
    }));
  }

getFilteredRoutinesList(objetivoId: number,
    metodoId: number): Promise<IRoutinesList[]> {
      const params = new HttpParams()
      .set('objetivos_id', objetivoId)
      .set('metodos_id', metodoId);
      return lastValueFrom(this.httpClient.get<IRoutinesList[]>(`${this.baseEndpoint}/filter`,
        {
          headers: this.getAuthHeaders(),
          params,
        }
      ));
    }

  }
