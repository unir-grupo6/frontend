import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

type Response = {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
private endpoint: string = "http://localhost:3000/api/users";
private httpClient = inject(HttpClient);

login(user: Iuser): Promise<Response> {
  return lastValueFrom(this.httpClient.post<Response>(`${this.endpoint}/login`, user));
}

}