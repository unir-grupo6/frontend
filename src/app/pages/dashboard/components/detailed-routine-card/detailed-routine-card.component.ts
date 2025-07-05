import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoutinesService } from '../../../../services/routines.service';
import { toast } from 'ngx-sonner'
import { Modal } from 'flowbite';

@Component({
  selector: 'app-detailed-routine-card',
  imports: [RouterLink],
  templateUrl: './detailed-routine-card.component.html',
  styleUrl: './detailed-routine-card.component.css',
})
export class DetailedRoutineCardComponent {
  @Input() rutina: any;
  routinesService = inject(RoutinesService);

  modal!: Modal;
  private lastFocusedElement: HTMLElement | null = null;

  ngAfterViewInit() {
    const id = `modalEl-${this.rutina?.id}`;
    const modalEl = document.getElementById(id);
    if (modalEl) {
      this.modal = new Modal(modalEl, {
        placement: 'center',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
        closable: true,
      });
    }
  }

  openModal(id: number) {
    this.lastFocusedElement = document.activeElement as HTMLElement;
    this.modal?.show();

    const modalEl = document.getElementById(`modalEl-${id}`);
    if (modalEl) {
      const closeBtn = modalEl.querySelector(
        'button[aria-label="Cerrar modal"]'
      ) as HTMLElement;
      if (closeBtn) {
        closeBtn.focus();
      }
    }
  }

  closeModal() {
    this.modal?.hide();
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }


  getNombreDia(dia: number): string {
    const dias = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    return dias[dia - 1] || 'N/A';
  }

  async deleteRoutine(id: string) {
    // confirmacion antes de borrar
    const id_rutina = parseInt(id);
    try {
      await this.routinesService.deleteRoutine(id_rutina);
      toast.success('Rutina eliminada correctamente.')
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log("Error al eliminar la rutina con id: ", id)
    }
  }
}
