import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';
import { IUserRegister } from '../interfaces/iuser-register.interface';

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
private httpClient = inject(HttpClient);

login(user: Iuser): Promise<Response> {
  return lastValueFrom(this.httpClient.post<Response>(`${this.endpoint}/login`, user));
}
register(user: IUserRegister): Promise<RegisterResponse> {
  return lastValueFrom(this.httpClient.post<RegisterResponse>(`${this.endpoint}/register`, user));

}
}