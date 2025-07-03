import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { IGoals } from '../interfaces/igoals.interface';
import { lastValueFrom, Observable } from 'rxjs';

type Response = {
  success: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private endpoint: string = "https://rutina-go-backend.onrender.com/api/users/";
  private url = "https://rutina-go-backend.onrender.com/api/users/update";
  private httpClient = inject(HttpClient);
  private endpointGoals: string = "https://rutina-go-backend.onrender.com/api/goals";

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // o donde tengas el token guardado
    return new HttpHeaders().set('Authorization', token);
  }


  getUserData(): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(this.endpoint, { headers: this.getAuthHeaders() })
    );
  }


  updatedUserData(userData: any): Promise<IUser> {
    userData.id_objetivo = userData.objetivo_id;
    delete userData.objetivo_id;

    return lastValueFrom(this.httpClient.put<IUser>(`${this.endpoint}update`, userData,  { headers: this.getAuthHeaders() }));
  }

  


  updatePassword(currentPassword: string, newPassword: string): Promise<IUser> {
    const body = {
      current_password: currentPassword,
      new_password: newPassword
    };

    return lastValueFrom(this.httpClient.put<IUser>(`${this.url}/update-password`, body, { headers: this.getAuthHeaders().set('Content-Type', 'application/json') }));
  }

    getGoals(): Promise<IGoals[]> {
    const url =`${this.endpointGoals}`;
    return lastValueFrom(
      this.httpClient.get<IGoals[]>(url, { headers: this.getAuthHeaders() })
    );
  }

  


}
