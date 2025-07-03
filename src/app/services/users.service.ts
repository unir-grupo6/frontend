import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
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


  getUserData(token: string): Promise<IUser> {
    const headers = new HttpHeaders({
      Authorization: token,
    });
    return lastValueFrom(this.httpClient.get<IUser>(this.endpoint, { headers })
    );
  }


  updatedUserData(token: string, userData: any): Promise<IUser> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

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


  


}
