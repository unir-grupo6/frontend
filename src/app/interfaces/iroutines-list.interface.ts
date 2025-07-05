export interface IRoutinesList {
  id_rutina: number;
  nombre: string;
  observaciones: string;
  realizada: boolean;
  objetivo: string; 
  dificultad: string;
  metodo: string;
  ejercicios: Ejercicio[];
}
export interface Ejercicio {
  id_ejercicio: number;
  orden: number;
  series: number;
  repeticiones: string;
  comentario: string;
  nombre: string;
  tipo: string;
  step_1: string;
  step_2: string;
  grupos_musculares: string;
}