export interface IProfile {
    id: number;
  nombre: string;
  apellidos: string;
  email: string;
  fecha_nacimiento: string; // formato: 'DD-MM-YYYY'
  sexo: number; // 1: Hombre, 2: Mujer, 3: Otro
  peso?: number;
  altura?: number;
  objetivo_id?: number;
  fecha_alta?: string;
}
