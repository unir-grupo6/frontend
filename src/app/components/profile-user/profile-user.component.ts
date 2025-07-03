import { Component, inject } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { IGoals } from '../../interfaces/igoals.interface';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import dayjs from 'dayjs';




@Component({
  selector: 'app-profile-user',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css'
})
export class ProfileUserComponent {

  user: IUser | null = null;
  userForm: FormGroup = new FormGroup({}, []);
  passwordForm: FormGroup = new FormGroup({}, []);
  editedUser: Partial<IUser> = {};
  isLoading = true;
  error: string | null = null;
  isEditModalOpen = false;
  isPasswordModalOpen = false;

  constructor(private usersService: UsersService) {
    this.userForm = new FormGroup({
      id: new FormControl(this.user?.id || null, []),
      nombre: new FormControl(this.user?.nombre || "", []),
      apellidos: new FormControl(this.user?.apellidos || "", []),
      email: new FormControl(this.user?.email || "", []),
      sexo: new FormControl(this.user?.sexo || 0, []),
      fecha_nacimiento: new FormControl(this.user?.fecha_nacimiento || null, []),
      fecha_alta: new FormControl(this.user?.fecha_alta || null, []),
      imc: new FormControl(this.user?.imc || 0, []),
      peso: new FormControl(this.user?.peso || 0, []),
      altura: new FormControl(this.user?.altura || 0, []),
      objetivo: new FormControl(this.user?.objetivo || "", []),    
    });
  }

  userService = inject(UsersService);
  opcionesObjetivos: IGoals[] = [];

  ngOnInit(): void {
    this.loadUserData();
    this.cargarOpcionesObjetivos();
  }


  private isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
    }

    
  


  private formatDateForForm(date: any): string | null {
    if(!date) return null;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!this.isValidDate(dateObj)) return null;

    if (this.user && date === this.user.fecha_alta) {
    return dateObj.toISOString(); // Mantiene fecha y hora para fecha_alta
  }
    
    return dateObj.toISOString().split('T')[0];
  }


  private normalizeObjetivo(objetivo: string): string {
  // Mapea diferentes formatos a valores consistentes
  const objetivoMap: Record<string, string> = {
    'tonificación': 'TONIFICACION',
    'tonificacion': 'TONIFICACION',
    'Tonificación': 'TONIFICACION',
    'TONIFICACIÓN': 'TONIFICACION'
  };
  
  return objetivoMap[objetivo.toLowerCase()] || objetivo;
  }
  


  async loadUserData(): Promise<void> {
    try {
      // En una aplicación real, obtendrías el token de un servicio de autenticación
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTIxNzA3MzUsImlhdCI6MTc1MTU2NTkzNX0.Own5KiDlzWGeViZmdAZFRv0Y4s3c_bqdT9CMopysDgE';
      
      /*const token = this.authService.getToken(); // o desde localStorage/sessionStorage
      if (!token) {
        this.error = 'No se encontró el token de autenticación.';
      return;*/


      this.user = await this.usersService.getUserData(token);

    if (this.user) {
      const objetivoNormalizado = this.normalizeObjetivo(this.user.objetivo);
      
      const userWithFormattedDates = {
        ...this.user,
        objetivo: objetivoNormalizado, // Usa el valor normalizado
        fecha_nacimiento: this.formatDateForForm(this.user.fecha_nacimiento),
        fecha_alta: this.formatDateTimeForDisplay(this.user.fecha_alta)
      };

      
      
      this.userForm.patchValue(userWithFormattedDates);
      console.log('Objetivo normalizado:', objetivoNormalizado);
    }
  } catch (error) {
    console.error('Error:', error);
      }
  }

      openEditModal() {
        const objetivoSeleccionado = this.userForm.get('objetivo')?.value;
        console.log('Objetivo seleccionado:', objetivoSeleccionado);

        this.isEditModalOpen = true;
      }

      private formatDateTimeForDisplay(date: any): string {
  if (!date) return '';

  let dateObj: Date;

  if (typeof date === 'string') {
    // Intenta parsear formato "dd-MM-yyyy HH:mm:ss"
    const regex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = date.match(regex);

    if (match) {
      const [_, day, month, year, hour, minute, second] = match;
      dateObj = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  if (!this.isValidDate(dateObj)) return 'Fecha no válida';

  // Devuelve como "dd/MM/yyyy HH:mm"
  return dateObj.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}




      closeEditModal() {
        this.isEditModalOpen = false;
      }

      async saveUserData(): Promise<void> {
      try {
        // validacion del formulario
        if (this.userForm.invalid) {
          this.userForm.markAllAsTouched();
          this.error = 'Hay campos inválidos en el formulario.';
          return;
        }

        console.log('Datos a enviar:', this.userForm.value);

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTIxNzA5NDAsImlhdCI6MTc1MTU2NjE0MH0.dRwBAWLyp6vJGEdMAaFDNrcqXlfBBtscNkyHaRf2wso'; // Tu token aquí

        console.log('Token que se enviará:', token); // Verifica que el token existe y es válido

        // Verificar token
        if (!token) {
          this.error = 'No se encontró el token de autenticación.';
          return;
        }

        // Prepara los datos para enviar
        const formData = {
          nombre: this.userForm.value.nombre,
          apellidos: this.userForm.value.apellidos,
          email: this.userForm.value.email,
          fecha_nacimiento: dayjs(this.formatDateForForm(this.userForm.value.fecha_nacimiento)).format('DD-MM-YYYY'),
          objetivo_id: Number(this.userForm.value.objetivo), // Aquí se usa el value del <option>
          peso: Number(this.userForm.value.peso),
          altura: Number(this.userForm.value.altura)
        };

        console.log('Datos preparados:', formData);

        // Llama al servicio para actualizar los datos
        const updatedUser = await this.usersService.updatedUserData(token, formData);

        // Actualiza el estado local con los nuevos datos
        this.user = updatedUser;
        alert('Datos actualizados correctamente');
        this.isEditModalOpen = false;

        // Normaliza los datos para el formulario
        const objetivoNormalizado = this.normalizeObjetivo(updatedUser.objetivo);
        const userWithFormattedDates = {
          ...updatedUser,
          objetivo: objetivoNormalizado,
          fecha_nacimiento: this.formatDateForForm(updatedUser.fecha_nacimiento),
          fecha_alta: this.formatDateTimeForDisplay(updatedUser.fecha_alta)
        };

        // Refresca el formulario con los datos actualizados
        this.userForm.patchValue(userWithFormattedDates);
        
        // Cierra el modal y muestra feedback
        this.isEditModalOpen = false;
        this.error = null;
        alert('Datos actualizados correctamente');
        
        } catch (error) {
            console.error('Error al actualizar:', error);
            this.error = 'Error al actualizar los datos. Por favor intenta nuevamente.';
        }
}

        // Nueva versión de prepareFormData que maneja correctamente las fechas
        private prepareFormData(data: any): any {
            // Copia los datos para no modificar el original
            const preparedData = { ...data };

            // Convertir fecha_alta si existe
            if (preparedData.fecha_alta) {
            try {
            // Parsear fecha en formato "30/06/2025, 16:25"
              const [datePart, timePart] = preparedData.fecha_alta.split(', ');
              const [day, month, year] = datePart.split('/');
            
              // Crear nueva fecha en formato ISO
              preparedData.fecha_alta = new Date(
                `${year}-${month}-${day}T${timePart}:00`
              ).toISOString();
              } catch (e) {
                console.error('Error al convertir fecha_alta:', e);
              // Opcional: puedes decidir eliminar el campo o manejarlo de otra forma
                delete preparedData.fecha_alta;
              }   
          }     

    // Convertir fecha_nacimiento si existe (formato "1994-12-31")
    if (preparedData.fecha_nacimiento) {
        try {
            preparedData.fecha_nacimiento = new Date(
                preparedData.fecha_nacimiento
            ).toISOString();
        } catch (e) {
            console.error('Error al convertir fecha_nacimiento:', e);
            delete preparedData.fecha_nacimiento;
        }
    }

    return preparedData;
}


      OpenPasswordModal() {
        this.isPasswordModalOpen = true;
      }

      closePasswordModal() {
        this.isPasswordModalOpen = false;
      }

    
      async updatePassword(newPassword: string): Promise<void> {
      try {
        if(this.passwordForm.invalid)
        return;

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTEzODg5MDYsImlhdCI6MTc1MTM4NzEwNn0.GfXbDws0fIA-2jjpPxoAOTXiaJ3ZxEbRj61nL8fDreQ';
        const currentPassword = this.passwordForm.value.oldPassword;
        const newPassword = this.passwordForm.value.newPassword;

        await this.usersService.updatePassword(token, currentPassword, newPassword);

        alert('Contraseña actualizada correctamente');
        this.passwordForm.reset();

        
      } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        this.error = 'Error al actualizar la contraseña';
      }
      }

      async cargarOpcionesObjetivos() {
        try{
          const result = await this.usersService.getGoals()
          this.opcionesObjetivos = result;
          console.log("cargadas opciones de objetivos:", result);
        }
        catch (error) {
          console.error('Error al cargar opciones de objetivos:', error);
          this.error = 'Error al cargar las opciones de objetivos';
        }
  
}

  private parseDate(fechaStr: string): Date {
    const [dia, mes, año] = fechaStr.split('-');
    return new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
  }

}












