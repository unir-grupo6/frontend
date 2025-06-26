import { Component } from '@angular/core';
import { NavComponent } from "../../shared/nav/nav.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-reset-request',
  imports: [NavComponent, FooterComponent, RouterLink],
  templateUrl: './password-reset-request.component.html',
  styleUrl: './password-reset-request.component.css'
})
export class PasswordResetRequestComponent {

}
