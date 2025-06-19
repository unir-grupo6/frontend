import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavComponent } from "../../shared/nav/nav.component";
import { FormsModule } from '@angular/forms';

import { UsersService } from '../../services/users.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FooterComponent, NavComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

usersService:any = inject(UsersService);

router = inject(Router)

showPassword = false;

  async getLogin(form:any){
    try {
    let response = await this.usersService.login(form.value);
    if (response && response.token) {
      localStorage.setItem('token', response.token);
      this.router.navigate(['/dashboard']);
      }
  } 
    
    catch (error: any) {
      toast.error(error.error.message)
    
  }
}
}
