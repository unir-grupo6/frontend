import { Component } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile-user',
  imports: [],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css'
})
export class ProfileUserComponent {

  user: IUser | null = null;
  editedUser: Partial<IUser> = {};
  isLoading = true;
  error: string | null = null;
  isEditModalOpen = false;
  isPasswordModalOpen = false;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    try {
      // En una aplicación real, obtendrías el token de un servicio de autenticación
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiZXhwIjoxNzUxMjExNjI2LCJpYXQiOjE3NTEyMDk4MjZ9.n3pHO_bLrst2ETM72F-__o8hcUdXeRT6ka7v1Rl8-jc';

      if (!token) {
        this.error = 'No se encontró el token de autenticación';
        return;
      }

      this.user = await this.usersService.getUserData(token);
      this.editedUser = {...this.user};
      this.isLoading = false;
      } catch (error) {
        this.error = 'Error al cargar datos del usuario';
        this.isLoading = false;
        console.log('Error:', error);
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
          if(!this.editedUser)
            return;
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiZXhwIjoxNzUxMTk4NzAxLCJpYXQiOjE3NTExOTY5MDF9.2g7E24OhYZcn00G852yHt1SNDfSbAcxcd1n5mqi9QCE';

          const updateUser = await this.usersService.updateUserData(token, this.editedUser);

          this.user = updateUser;
          this.isEditModalOpen = false;
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
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiZXhwIjoxNzUxMTM1Mjc0LCJpYXQiOjE3NTExMzM0NzR9.wYPP0d4mIyba5K6OM75x9MlnVMTbybsISnx83tTx2us';

      await this.usersService.updatePassword(token, newPassword);
      this.isPasswordModalOpen = false;
      // Recargar datos para mostrar la contraseña actualizada
      await this.loadUserData();
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      this.error = 'Error al actualizar la contraseña';
    }
  }
  }













