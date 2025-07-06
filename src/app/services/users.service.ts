import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser, ILoginUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';
import { IUserRegister } from '../interfaces/iuser-register.interface';
import { IForgotPasswordRequest, IForgotPasswordResponse } from '../interfaces/iforgot-password.interface';
import { IResetPasswordRequest, IResetPasswordResponse } from '../interfaces/ireset-password.interface';
import { IGoals } from '../interfaces/igoals.interface';

type Response = {
  message: string;
  token: string;
}

type RegisterResponse = IUserRegister & { id: number, fecha_alta: string };

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private endpoint: string = "https://rutina-go-backend.onrender.com/api/users";
  private endpointGoals: string = "https://rutina-go-backend.onrender.com/api/goals";

  private httpClient = inject(HttpClient);  

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; 
    return new HttpHeaders().set('Authorization', token);
  }

  login(user: ILoginUser): Promise<Response> {
  return lastValueFrom(this.httpClient.post<Response>(`${this.endpoint}/login`, user));
  }
  register(user: IUserRegister): Promise<RegisterResponse> {
  return lastValueFrom(this.httpClient.post<RegisterResponse>(`${this.endpoint}/register`, user));
  }

  forgotPassword(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
    return lastValueFrom(
      this.httpClient.put<IForgotPasswordResponse>(`${this.endpoint}/forgot-password`, data)
    );
  }

  resetPassword(token: string, data: IResetPasswordRequest): Promise<IResetPasswordResponse> {
    const headers = {
      'reset-token': token,
      'Content-Type': 'application/json'
    };

    console.log(data);


    return lastValueFrom(
      this.httpClient.put<IResetPasswordResponse>(
        `${this.endpoint}/reset-password`,
        data,
        { headers }
      )
    );
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
