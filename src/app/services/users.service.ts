import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

type Response = {
  success: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private endpoint: string = "https://rutina-go-backend.onrender.com/api/users/";
  private httpClient = inject(HttpClient);


  getUserData(token: string): Promise<IUser> {
    const headers = new HttpHeaders({
      Authorization: token,
    });


    return lastValueFrom(this.httpClient.get<IUser>(this.endpoint, { headers })
    );
  }
}
