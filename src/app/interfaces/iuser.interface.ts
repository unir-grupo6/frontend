export interface IUser {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    sexo: number;
    fecha_nacimiento: Date;
    fecha_alta: Date;
    peso: number;
    altura: number;
    imc: number;
    objetivo: string;
    password: string;
    objetivo_id: number;
}

export interface Igoals{
    id: number;
    id_metodos: number;
    nombre: string;
}
