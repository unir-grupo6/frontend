import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavComponent } from "../../shared/nav/nav.component";

@Component({
  selector: 'app-login',
  imports: [RouterLink, FooterComponent, NavComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
