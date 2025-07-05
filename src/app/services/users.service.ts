import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { IGoals } from '../interfaces/igoals.interface';
import { lastValueFrom, Observable } from 'rxjs';

type Response = {
  success: string;
  token: string;
}

interface ChangePasswordResponse { message: string }

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private endpoint: string = "https://rutina-go-backend.onrender.com/api/users/";
  private url = "https://rutina-go-backend.onrender.com/api/users/update";
  private httpClient = inject(HttpClient);
  private endpointGoals: string = "https://rutina-go-backend.onrender.com/api/goals";

  
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; 
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

  


  changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const url = `${this.endpoint}update-password`;
    const body = {
      oldPassword,
      password: newPassword
    };

    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Authorization': token,
      'Content-Type': 'application/json'
    })

    return lastValueFrom(this.httpClient.put<{ message: string }>(url, body, { headers }));
  }


    getGoals(): Promise<IGoals[]> {
    const url =`${this.endpointGoals}`;
    return lastValueFrom(
      this.httpClient.get<IGoals[]>(url, { headers: this.getAuthHeaders() })
    );
  }

  


}
