import { Component } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

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
      password: new FormControl(this.user?.password || "", []),    
    });
  }


  ngOnInit(): void {
    this.loadUserData();
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
  


  async loadUserData(): Promise<void> {
    try {
      // En una aplicación real, obtendrías el token de un servicio de autenticación
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTE0NjIzODYsImlhdCI6MTc1MTQ2MDU4Nn0.5dbavCZGsbzmr8VwjJRY9kHm9W13COFe_EBSvqbj-oA';
      

      if (!token) {
        this.error = 'No se encontró el token de autenticación';
        return;
      }

      this.user = await this.usersService.getUserData(token);
      

      if(this.user) {
        console.log('Fecha alta recibida:', this.user.fecha_alta);
        console.log('Fecha alta formateada:', this.formatDateTimeForDisplay(this.user.fecha_alta));

        const userWithFormattedDates = {
          ...this.user,
          fecha_nacimiento: this.formatDateForForm(this.user.fecha_nacimiento),
          fecha_alta: this.formatDateTimeForDisplay(this.user.fecha_alta)
        };
        
        this.userForm.patchValue(userWithFormattedDates);
      }
      this.editedUser = {...this.user};
      this.isLoading = false;
      } catch (error) {
        this.error = 'Error al cargar datos del usuario';
        this.isLoading = false;
        console.error(error);
      }
  }

      openEditModal() {
        if (this.user) {
    this.editedUser = {
      ...this.user,
      fecha_alta: this.formatDateTimeForDisplay(this.user.fecha_alta) as any
    };
    
    this.isEditModalOpen = true;
  }
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

      async saveUserData(): Promise<void>{
        try {
          if(this.userForm.invalid) {
            this.error = 'Hay campos invalidos en el formulario.';
            return;
          }

          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTEzODg5MDYsImlhdCI6MTc1MTM4NzEwNn0.GfXbDws0fIA-2jjpPxoAOTXiaJ3ZxEbRj61nL8fDreQ';

          if(!token) {
            this.error = 'No se encontro el token de autenticacion.';
            return;
          }

          const formValue = this.userForm.value;
          const dataToSend = {
            ...formValue,
            fecha_nacimiento: formValue.fecha_nacimiento 
            ? new Date(formValue.fecha_nacimiento).toISOString().split('T')[0]
            : null,
            fecha_alta: formValue.fecha_alta
            ? new Date(formValue.fecha_alta).toISOString()
            : null
          };

          const updatedUserData = this.userForm.value;

          const updatedUser = await this.usersService.updatedUserData(token, updatedUserData);

          
          await this.loadUserData();
          this.isEditModalOpen = false;
          this.user = null;
          alert('datos actualizados correctamente.')
        } catch (error) {
          console.error('Error al actualizar los datos:', error);
          this.error = 'Hubo un error actualizar los datos';
        }
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
      const newPassword = this.passwordForm.get('newPassword')?.value;

      await this.usersService.updatePassword(token, newPassword);
      this.closePasswordModal();
      // Recargar datos para mostrar la contraseña actualizada
      //await this.loadUserData();
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      this.error = 'Error al actualizar la contraseña';
    }
  }
  }













