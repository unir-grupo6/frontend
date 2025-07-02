import { Component } from '@angular/core';
import { OverviewRoutineCardComponent } from '../../components/overview-routine-card/overview-routine-card.component';
import { DetailedRoutineCardComponent } from '../../components/detailed-routine-card/detailed-routine-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routines',
  imports: [DetailedRoutineCardComponent, RouterLink],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.css',
})
export class RoutinesComponent {
  /* Lógica de las pestañas de tabulación */
  tabs = [
    { key: 'misrutinas', label: 'Mis Rutinas' },
    { key: 'sugerencias', label: 'Sugerencias' },
    { key: 'descubrir', label: 'Descubrir' },
  ];

  activeTab = 'misrutinas';

  selectTab(key: string) {
    this.activeTab = key;
  }

  /* Rutina de prueba (obtener con el servicio) */
  rutina = {
  id: 2407,
  nombre: "Rutina Principiante Full Body",
  fecha_inicio_rutina: "22-09-2023",
  fecha_fin_rutina: "22-09-2025",
  rutina_activa: true,
  rutina_observaciones: "Ideal para empezar en gimnasio",
  nivel: "Principiante",
  metodo_nombre: "Entrenamiento en circuito",
  tiempo_aerobicos: "15 seg",
  tiempo_anaerobicos: "30 seg",
  descanso: "30 seg",
  ejercicios: [
    { nombre: "Press de banca" },
    { nombre: "Curl de antebrazos" },
    { nombre: "Elevación de talones" }
  ]
};
}
