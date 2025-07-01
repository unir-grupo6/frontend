import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { NavComponent } from '../../shared/nav/nav.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { GoalsService } from '../../services/goals.service';
import { IGoals } from '../../interfaces/igoals.interface';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, NavComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  usersService: any = inject(UsersService);
  router = inject(Router);

  menuAbierto: boolean = false;
  userForm: FormGroup;

  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  dias: number[] = [];
  anios: number[] = [];
  goals: IGoals[] = [];

  submitted = false;

  meses: any;

  constructor(private goalsService: GoalsService) {
    this.userForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\w.]+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[1-9]/),
        Validators.pattern(/[^A-Za-z0-9]/),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[1-9]/),
        Validators.pattern(/[^A-Za-z0-9]/),
      ]),
      sexo: new FormControl('', [Validators.required]),
      // Campos Fecha de nacimiento
      day: new FormControl('', [Validators.required]),
      month: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      objetivo_id: new FormControl('', [Validators.required]),
      peso: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,3})?$/),
      ]),
      altura: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
    });
  }

  ngOnInit() {
    this.generarDias();
    this.generarAños();
    this.loadGoals();
    this.meses = [
      { value: '01', name: 'Enero' },
      { value: '02', name: 'Febrero' },
      { value: '03', name: 'Marzo' },
      { value: '04', name: 'Abril' },
      { value: '05', name: 'Mayo' },
      { value: '06', name: 'Junio' },
      { value: '07', name: 'Julio' },
      { value: '08', name: 'Agosto' },
      { value: '09', name: 'Septiembre' },
      { value: '10', name: 'Octubre' },
      { value: '11', name: 'Noviembre' },
      { value: '12', name: 'Diciembre' },
    ];
  }

  loadGoals(){
    this.goalsService.getAllGoals()
      .then(data => {
        this.goals = data;
      })
      .catch(error => {
        console.error('Error al cargar las metas:', error);
      });
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
    return (
      !!control &&
      (control.dirty || this.submitted) &&
      control.hasError(errorName)
    );
  }

  getDataForm() {
    this.submitted = true;

    if (this.userForm.valid) {
      const password = this.userForm.get('password')?.value;
      const confirm_password = this.userForm.get('confirm_password')?.value;

      if (password === confirm_password) {
        const rawForm = this.userForm.value;

        const fecha_nacimiento = `${String(rawForm.day).padStart(2, '0')}-${String(rawForm.month).padStart(2, '0')}-${rawForm.year}`;


        console.log(typeof fecha_nacimiento, fecha_nacimiento);

        const formData = {
          nombre: rawForm.nombre,
          apellidos: rawForm.apellidos,
          email: rawForm.email,
          password: rawForm.password,
          sexo: Number(rawForm.sexo),
          fecha_nacimiento,
          peso: Number(rawForm.peso),
          altura: Number(rawForm.altura),
          objetivo_id: Number(rawForm.objetivo_id),
        };

        this.usersService
          .register(formData)
          .then((res: any) => {
            toast.success(
              'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
            );
            this.userForm.reset();
            this.submitted = false;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          })
          .catch((err: any) => {
            console.error('Error del servidor:', err);
            const message = err?.error?.message;

            if (message === 'Email already exists') {
              toast.error('Este correo ya está registrado.');
            } else if (message?.includes('Password')) {
              toast.error(
                'La contraseña no cumple con los requisitos de seguridad.'
              );
            } else {
              toast.error('Error en el registro. Intenta de nuevo.');
            }
          });
      } else {
        this.userForm.get('confirm_password')?.setErrors({ mismatch: true });
        toast.error('Las contraseñas no coinciden.');
      }
    } else {
      this.userForm.markAllAsTouched();
      toast.error('Por favor, complete los campos en blanco.');
    }
  }
}
