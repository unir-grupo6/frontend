import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavComponent } from "../../shared/nav/nav.component";

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, FooterComponent, NavComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

}
