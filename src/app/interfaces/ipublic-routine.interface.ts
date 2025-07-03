export interface IPublicRoutine {
    id_rutina: number;
    nombre: string;
    observaciones: string;
    compartida: boolean;
    objetivo: string;
    dificultad: string;
    metodo: string;
    ejercicios: {
        id_ejercicio: number;
        orden: number;
        series: number | null;
        repeticiones: string | null;
        dia: string | null;
        comentario: string;
        nombre: string;
        tipo: string;
        step_1: string;
        step_2: string;
        grupos_musculares: string;
    }[];
}
