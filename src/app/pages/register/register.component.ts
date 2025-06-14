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

  ngOnInit() {
    this.generarDias();
    this.generarAños();
  }


  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }


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
      objetivo: new FormControl("", [
        Validators.required
      ]),
      peso: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]),
      altura: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ])
    }, []
  );
  }


  passMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm_password = group.get('password')?.value;
    return password === confirm_password ? null: { passwordMismatch: true};
  }


  generarDias() {
    for (let i = 1; i <= 31; i++) {
      this.dias.push(i);
    }
  }


  onSubmit() {
    if (this.userForm.valid) {
      toast('Las contraseñas coinciden!')
    }
  }
  

  generarAños() {
    const añoActual = new Date().getFullYear();
    const añoInicio = añoActual - 100; //Opcion: desde hace 100 años
    for (let i = añoActual; i >= añoInicio; i--) {
      this.anios.push(i);
    } 
   }


  
  getDataForm() {
    if (this.userForm.valid) {
      if (this.userForm.get('password')?.value === this.userForm.get('confirm_password')?.value) {
        toast.success('Registro con exito! Las contraseñas coinciden.');
      } else {
        toast.error('Las contraseñas no coinciden.');
      }
    } else {
      toast.error('Por favor complete todos los campos correctamente.')
    }
  }


  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.userForm.get(controlName)?.hasError(errorName) && this.userForm.get(controlName)?.touched
  }


  togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }


  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  }



