import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  menuAbierto: boolean = false;
  userForm: FormGroup;

  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  dias: number[] = [];
  anios: number[] = [];

  submitted = false;


  constructor() {
    this.userForm = new FormGroup({
      nombre: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ]),
      apellidos: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\w+\@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16)
      ]),
      confirm_password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16)
      ]),
      sexo: new FormControl("", [
        Validators.required
      ]),
      // Campos Fecha de nacimiento
      day: new FormControl("", [
        Validators.required
      ]),
      month: new FormControl("", [
        Validators.required
      ]),
      year: new FormControl("", [
        Validators.required
      ]),
      objetivo: new FormControl("", [
        Validators.required
      ]),
      peso: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,3})?$/)
      ]),
      altura: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ])
    },);
  }


  ngOnInit() {
    this.generarDias();
    this.generarAños();
  }


  generarDias() {
    for (let i = 1; i <= 31; i++) {
      this.dias.push(i);
    }
  }


  generarAños() {
    const añoActual = new Date().getFullYear();
    const añoInicio = añoActual - 100; //Opcion: desde hace 100 años
    for (let i = añoActual; i >= añoInicio; i--) {
      this.anios.push(i);
    } 
   }


   toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }


   togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }


  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  checkControl(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && (control.dirty || this.submitted) && control.hasError(errorName);
  }


  getDataForm() {
    this.submitted = true;

    if (this.userForm.valid) {
      const password = this.userForm.get('password')?.value;
      const confirm_password = this.userForm.get('confirm_password')?.value;

      if (password === confirm_password) {
        toast.success('Las contraseñas coinciden. Registro EXITOSO!.');
        this.userForm.reset();
        this.submitted = false;
      } else {
        this.userForm.get('confirm_password')?.setErrors({ mismatch: true });
        toast.error('Las contraseñas NO coinciden.');
      }
    } else {
      this.userForm.markAllAsTouched();
      toast.error('Por favor, complete los campos en blanco.');
    }
  }

  
}



