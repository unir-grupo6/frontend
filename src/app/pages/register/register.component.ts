import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  menuAbierto: boolean = false;
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


  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword; // Devuelve true si las contraseñas coinciden
  }


  togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }


  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  
  // Mensaje de error
  errorMessage: string = "";

  

}

