import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private endpoint: string = " https://rutina-go-backend.onrender.com/api/users/login"
  private httpClient = inject(HttpClient);

  login(user: IUser): Promise<Response> {
    
  }
}
