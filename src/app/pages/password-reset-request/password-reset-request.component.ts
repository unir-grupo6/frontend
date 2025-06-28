import { Component } from '@angular/core';
import { NavComponent } from "../../shared/nav/nav.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { UsersService } from '../../services/users.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-password-reset-request',
  imports: [NavComponent, FooterComponent, FormsModule, ReactiveFormsModule,NgClass],
  templateUrl: './password-reset-request.component.html',
  styleUrl: './password-reset-request.component.css'
})
export class PasswordResetRequestComponent {
  passwordForm: FormGroup;
  password: string = '';
  password_repeat: string = '';
  showPassword: boolean = false;
  showPasswordRepeat: boolean = false;
  submitted = false;
  resetToken: string = '';
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private router: Router, private route: ActivatedRoute, private userService: UsersService) {
    this.passwordForm = new FormGroup({
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16)
      ]),
      password_repeat: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16)
      ])
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
    });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000); // ocultar después de 3 segundos
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  togglePasswordRepeatVisibility() {
    this.showPasswordRepeat = !this.showPasswordRepeat;
  }

  checkControl(controlName: string, errorName: string): boolean {
    const control = this.passwordForm.get(controlName);
    return !!control && (control.dirty || this.submitted) && control.hasError(errorName);
  }

  async getDataForm() {
    this.submitted = true;

    if (this.passwordForm.valid) {
      const password = this.passwordForm.get('password')?.value;
      const password_repeat = this.passwordForm.get('password_repeat')?.value;

      if (password === password_repeat) {
        try {
          const response = await this.userService.resetPassword(this.resetToken, { newPassword: password });
          this.showToast('Cambio de Contraseña Realizado!', "success");
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
          this.passwordForm.reset();
          this.submitted = false;
        } catch (error: any) {
          this.showToast('Hubo un error al intentar restablecer la contraseña.', "error");
          console.error('Error en el restablecimiento de la contraseña:', error);
        }
      } else {
        this.passwordForm.get('password_repeat')?.setErrors({ mismatch: true });
        this.showToast('Las contraseñas NO coinciden.', "error");
      }
    } else {
      this.passwordForm.markAllAsTouched();
      this.showToast('Por favor, complete los campos en blanco.', "error");
    }
  }
}
