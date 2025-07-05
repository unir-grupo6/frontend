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
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[1-9]/),
        Validators.pattern(/[^A-Za-z0-9]/),
      ]),
      password_repeat: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[1-9]/),
        Validators.pattern(/[^A-Za-z0-9]/),
      ])
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    this.resetToken = params['reset-token'];
    console.log('Token:', this.resetToken);
    });
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
          const response = await this.userService.resetPassword(this.resetToken, { password: password });
          toast.success('Cambio de Contraseña Realizado!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
          this.passwordForm.reset();
          this.submitted = false;
        } catch (error: any) {
        toast.error('Hubo un error al intentar restablecer la contraseña.');
          console.error('Error en el restablecimiento de la contraseña:', error);
        }
      } else {
        this.passwordForm.get('password_repeat')?.setErrors({ mismatch: true });
        toast.error('Las contraseñas NO coinciden.');
      }
    } else {
      this.passwordForm.markAllAsTouched();
      toast.error('Por favor, complete los campos en blanco.');
    }
  }
}
