import { IExercise } from "./iexercise.interface";

export interface IRoutine {
  rutina_id: number;
  nombre: string;
  fecha_inicio_rutina: string;
  fecha_fin_rutina: string;
  dia: number;
  rutina_activa: boolean;
  rutina_observaciones: string;
  nivel: string;
  metodo_nombre: string;
  tiempo_aerobicos: string;
  tiempo_anaerobicos: string;
  descanso: string;
  metodo_observaciones: string;
  ejercicios: IExercise[];
}
