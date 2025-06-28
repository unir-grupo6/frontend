import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavComponent } from "../../shared/nav/nav.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { UsersService } from '../../services/users.service';
import { IForgotPasswordRequest } from '../../interfaces/iforgot-password.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, FooterComponent, NavComponent, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  userForm: FormGroup;
  email: string = '';
  submitted = false;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  setTimeout(() => {
    this.toastVisible = false;
  }, 3000); // ocultar después de 3 segundos
}

  constructor(private router: Router, private userService: UsersService) {
    this.userForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[\w\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ])
    },);
  }

async onForgotPassword() {
    this.submitted = true;

    if (this.userForm.invalid) {
      this.showToast('Por favor, ingresa un correo electrónico válido.', "error");
      return;
    }

    const email = this.userForm.get('email')?.value;

  if (email) {
    const requestData: IForgotPasswordRequest = { email };

    try {
      const response = await this.userService.forgotPassword(requestData);
      this.showToast(response.message, "success");
      console.log(response)
    } catch (error: any) {
      if (error.status === 403 && error.error.message === 'User not found') {
        this.showToast('Este correo electrónico no está registrado. Por favor, verifica el correo o regístrate.', "error");
      } else {
        this.showToast('Hubo un error al intentar enviar el enlace de recuperación.', "error");
      }
      console.error('Error al intentar recuperar la contraseña:', error);
    }
  } else {
    this.showToast('Por favor, ingresa un correo electrónico válido.', "error");
  }
}

  checkControl(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && (control.dirty || this.submitted) && control.hasError(errorName);
  }

  /*getDataForm() {
      this.submitted = true;

      if (this.userForm.valid) {
        const email = this.userForm.get('email')?.value;

        if (email) {
          toast.success('Correo Enviado!. Revisa tu correo electrónico para completar el proceso.');
          setTimeout(() => {
          this.router.navigate(['/login']);}, 1000);

          this.userForm.reset();
          this.submitted = false;
        }
      } else {
        this.userForm.markAllAsTouched();
        toast.error('Por favor, complete los campos en blanco.');
      }
    }*/
}
