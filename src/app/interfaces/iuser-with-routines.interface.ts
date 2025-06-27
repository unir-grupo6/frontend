import { IRoutine } from './iroutine.interface';

export interface IUserWithRoutines {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  fecha_alta: string;
  peso: number;
  altura: number;
  imc: number;
  rutinas: IRoutine[];
}
