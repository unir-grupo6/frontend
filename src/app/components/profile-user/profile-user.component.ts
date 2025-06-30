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
      fechaNac: new FormControl(this.user?.fecha_nacimiento || "", []),
      fechaAlta: new FormControl(this.user?.fecha_alta || Date, []),
      imc: new FormControl(this.user?.imc || 0, []),
      peso: new FormControl(this.user?.peso || 0, []),
      altura: new FormControl(this.user?.altura || 0, []),
      objetivo: new FormControl(this.user?.objetivo || "", []),
      password: new FormControl(this.user?.password || "", []),    
    });


    //Cambio de contraseña
    this.passwordForm = new FormGroup({
      password: new FormControl(this.user?.password || "", []),
    });
  }


  ngOnInit(): void {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    try {
      // En una aplicación real, obtendrías el token de un servicio de autenticación
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiZXhwIjoxNzUxMjk2NTI2LCJpYXQiOjE3NTEyOTQ3MjZ9.RHHKdlX9isJcFrHyRzDsvvyjzemXVSmA0ZJ72Di84Lg';
      

      if (!token) {
        this.error = 'No se encontró el token de autenticación';
        return;
      }

      this.user = await this.usersService.getUserData(token);

      if(this.user) {
        this.userForm.patchValue(this.user);
      }
      //this.editedUser = {...this.user};
      this.isLoading = false;
      } catch (error) {
        this.error = 'Error al cargar datos del usuario';
        this.isLoading = false;
        console.error(error);
      }
  }

      openEditModal() {
        this.editedUser = {...this.user};
        this.isEditModalOpen = true;
      }

      closeEditModal() {
        this.isEditModalOpen = false;
      }

      async saveUserData(): Promise<void>{
        try {
          if(this.userForm.invalid)
            return;

          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiZXhwIjoxNzUxMjk2NTI2LCJpYXQiOjE3NTEyOTQ3MjZ9.RHHKdlX9isJcFrHyRzDsvvyjzemXVSmA0ZJ72Di84Lg';

          const updateUser = await this.usersService.updateUserData(token, this.userForm.value);

          this.user = updateUser;
          this.closeEditModal();
        } catch (error) {
          console.log('Error al actualizar:', error);
          this.error = 'Error al actualizar los datos';
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

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiZXhwIjoxNzUxMjk2NTI2LCJpYXQiOjE3NTEyOTQ3MjZ9.RHHKdlX9isJcFrHyRzDsvvyjzemXVSmA0ZJ72Di84Lg';
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













