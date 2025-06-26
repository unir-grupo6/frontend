import { Component, Input } from '@angular/core';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-dashboard-card',
  imports: [],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {
  @Input() name: string = '';
  @Input() type: string = '';
  @Input() level: string = '';
  @Input() muscle: string = '';
  @Input() firstPosition: string = '';
  @Input() movement: string = '';

modal!: Modal;

  ngAfterViewInit() {
    const modalEl = document.getElementById('modalEl');
    if (modalEl) {
      this.modal = new Modal(modalEl, {
        placement: 'center',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 fixed inset-0 z-40',
        closable: true,
        onHide: () => console.log('Modal oculto'),
        onShow: () => console.log('Modal abierto'),
        onToggle: () => console.log('Modal alternado'),
      });
    }
  }

  openModal() {
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
  }
}
