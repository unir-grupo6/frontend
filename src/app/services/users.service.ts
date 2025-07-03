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


  getUserData(token: string): Promise<IUser> {
    const headers = new HttpHeaders({
      Authorization: token,
    });
    return lastValueFrom(this.httpClient.get<IUser>(this.endpoint, { headers })
    );
  }


  updatedUserData(token: string, userData: any): Promise<IUser> {
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    });

    console.log('User data to update:', userData);

    userData.id_objetivo = userData.objetivo_id;
    delete userData.objetivo_id;

    console.log('User data after modification:', userData);

    return lastValueFrom(this.httpClient.put<IUser>(`${this.endpoint}update`, userData,  { headers }));
  }

  


  updatePassword(token: string, currentPassword: string, newPassword: string): Promise<IUser> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      current_password: currentPassword,
      new_password: newPassword
    };

    return lastValueFrom(this.httpClient.put<IUser>(`${this.url}/update-password`, body, { headers }));
  }

    getGoals(): Promise<IGoals[]> {
    const url =`${this.endpointGoals}`;
    return lastValueFrom(
      this.httpClient.get<IGoals[]>(url, { headers: this.getAuthHeaders() })
    );
  }

  


}
