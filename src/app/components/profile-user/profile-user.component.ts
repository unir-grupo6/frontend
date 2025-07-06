import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { IGoal } from '../../interfaces/igoals.interface';
import { UsersService } from '../../services/users.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { toast } from 'ngx-sonner'


@Component({
  selector: 'app-profile-user',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css'
})
export class ProfileUserComponent {
  @ViewChild('crudModal') crudModal!: ElementRef<HTMLDivElement>;

  showNewPassword: boolean = false;
  showRepeatPassword: boolean = false;

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
      peso: new FormControl(this.user?.peso || 0, []),
      altura: new FormControl(this.user?.altura || 0, []),
      objetivo: new FormControl(this.user?.objetivo || "", []),    
    });
  }

  userService = inject(UsersService);
  opcionesObjetivos: IGoal[] = [];

  opcionesSexo: { id: number, label: string }[] = [
    { id: 1, label: 'Masculino' },
    { id: 2, label: 'Femenino' },
    { id: 3, label: 'Otro' }
  ];

  get sexoLabel(): string | undefined {
  if (!this.user || !this.opcionesSexo) return undefined;
  const found = this.opcionesSexo.find(opcion => opcion.id === this.user?.sexo);
  return found?.label;
}

  ngOnInit(): void {
    this.loadUserData();
    this.cargarOpcionesObjetivos();

    this.passwordForm = new FormGroup({
      oldPassword:    new FormControl('', [Validators.required]),
      newPassword:    new FormControl('', [Validators.required, Validators.minLength(8)]),
      repeatPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordsMatch });
  }


  // Validador de password
  passwordsMatch(group: AbstractControl) {
    const np = group.get('newPassword')?.value;
    const rp = group.get('repeatPassword')?.value;
    if (np !== rp) {
    // Asignamos el error al control repeatPassword
    group.get('repeatPassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
    }

    // limpia el error si ya no hay desacuerdo
    group.get('repeatPassword')?.setErrors(null);
    return null;
  }

  // Carga de datos del usuario
  async loadUserData(): Promise<void> {
    try {
      this.user = await this.usersService.getUserData();

      if (this.user) {
        
        const userWithFormattedDates = {
          ...this.user,
          fecha_nacimiento: this.user.fecha_nacimiento,
        };
        this.userForm.patchValue(userWithFormattedDates);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  private modalOpen = false;


  // Acciones cuando se abre el modal  
  openEditModal() {
    // Parchear el objetivo
    this.userForm.patchValue({ objetivo: this.user?.objetivo_id});
    this.userForm.patchValue({ sexo: this.user?.sexo })

    // Desabilitaamos estos campos
    this.userForm.get('fecha_alta')?.disable();
    this.userForm.get('imc')?.disable();

    // Quitamos la clase hidden
    this.crudModal.nativeElement.classList.remove('hidden');
    this.modalOpen = true;
  }


  // Acciones cuando se cierra el modal
  closeEditModal() {
    // Volvemos a ocultar el modal
    this.crudModal.nativeElement.classList.add('hidden');
    this.modalOpen = false;
  }


  // Formateo de fechas con hora
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


  async saveUserData(): Promise<void> {
    try {
      // validacion del formulario
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        this.error = 'Hay campos inválidos en el formulario.';
        return;
      }

      // Prepara los datos para enviar
      const formData = {
        nombre: this.userForm.value.nombre,
        apellidos: this.userForm.value.apellidos,
        email: this.userForm.value.email,
        fecha_nacimiento: this.userForm.value.fecha_nacimiento,
        sexo: Number(this.userForm.value.sexo),
        objetivo_id: Number(this.userForm.value.objetivo),
        peso: Number(this.userForm.value.peso),
        altura: Number(this.userForm.value.altura)
      };

      // Llama al servicio para actualizar los datos
      const updatedUser = await this.usersService.updatedUserData(formData);

      // Actualiza el estado local con los nuevos datos
      this.user = updatedUser;

      // Normaliza los datos para el formulario
      this.userForm.patchValue({
        id: updatedUser.id,
        nombre: updatedUser.nombre,
        apellidos: updatedUser.apellidos,
        email: updatedUser.email,
        fecha_nacimiento: updatedUser.fecha_nacimiento,
        sexo: updatedUser.sexo,
        imc: updatedUser.imc,
        peso: updatedUser.peso,
        altura: updatedUser.altura,
        objetivo: updatedUser.objetivo_id
      });
      toast.success('Datos actualizados correctamente');
      this.closeEditModal();
    
    } catch (error) {
        console.error('Error al actualizar:', error);
        this.error = 'Error al actualizar los datos. Por favor intenta nuevamente.';
    }
  }

  // Apertura del modal
  OpenPasswordModal() {
    this.isPasswordModalOpen = true;
  }


  // Cierre del modal del password
  closePasswordModal() {
    this.isPasswordModalOpen = false;
  }

    
  // Funcion para actualizar las password del usuario
  async updatePassword(newPassword: string): Promise<void> {
    try {
      if(this.passwordForm.invalid)
      return;

      const currentPassword = this.passwordForm.value.oldPassword;
      const newPassword = this.passwordForm.value.newPassword;

      await this.usersService.changePassword(currentPassword, newPassword);

      toast.success('Contraseña actualizada correctamente');
      this.passwordForm.reset();

      
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      this.error = 'Error al actualizar la contraseña';
    }
  }
  

  // Cargar el objetivo con su ID
  async cargarOpcionesObjetivos() {
    try{
      const result = await this.usersService.getGoals()
      this.opcionesObjetivos = result;
      // Asignar el objetivo actual al formulario
      const objetivoActual = this.user?.objetivo_id || null;
      if (objetivoActual) {
        this.userForm.patchValue({ objetivo: objetivoActual });
      }
    }
    catch (error) {
      console.error('Error al cargar opciones de objetivos:', error);
      this.error = 'Error al cargar las opciones de objetivos';
    }
  }


  // Funcion para comparar las contraseñas
  private passwordsEqual(): boolean {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const repeatPassword = this.passwordForm.get('repeatPassword')?.value;
    return newPassword === repeatPassword;
  }


  // Funcion para cambiar la password antigua por la nueva
  async onChangePassword(): Promise<void> {
    if(this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();

    if(this.passwordForm.hasError('mismatch')) {
      toast.error('Las contraseñas no coinciden.');
    }
      return;
    }

    // Comprueba el error a nivel de grupo
    if (this.passwordForm.hasError('mismatch')) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if(!this.passwordsEqual()) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;

    try {
      const res = await this.usersService.changePassword(oldPassword, newPassword);
      toast.success(res.message);
      this.passwordForm.reset();
      this.isPasswordModalOpen = false;
    } catch (err: any) {
      toast.error('Error al cambiar contraseña');
    }
  }

  // Funcion para el icono de ver/ocultar las password
  togglePasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
      this.showRepeatPassword = !this.showRepeatPassword;
    }

}














function dayjs(raw: Date, INPUT_FORMATS: string[], arg2: boolean) {
  throw new Error('Function not implemented.');
}

