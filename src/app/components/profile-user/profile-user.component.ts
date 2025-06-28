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

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiZXhwIjoxNzUxMTI0MDYxLCJpYXQiOjE3NTExMjIyNjF9.n34MpgphUZUluA8ID_vDDaFZif10xIwtDp3tiUHeRQQ'

      if (!token) {
        console.error('No se encontró el token en localStorage');
        return;
      }

      this.user = await this.usersService.getUserData(token);
      console.log('Usuario:', this.user);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }
}



// Encuentra todos los botones con el atributo data-modal-toggle
/*document.querySelectorAll('[data-modal-toggle]').forEach(button => {
  button.addEventListener('click', function () {
    const modalId = this.getAttribute('data-modal-target');
    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.toggle('hidden');
    }
  });
});

// Encuentra todos los botones con el atributo data-modal-hide
document.querySelectorAll('[data-modal-hide]').forEach(button => {
  button.addEventListener('click', function () {
    const modalId = this.getAttribute('data-modal-hide');
    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.add('hidden');
    }
  });
});


  onEditClick() {
    throw new Error('Method not implemented.');
  }*/


