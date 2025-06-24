import { Component } from '@angular/core';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-dashboard-card',
  imports: [],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {

  modal!: Modal;
 

  ngAfterViewInit() {
    const modalEl = document.getElementById('modalEl');
    if(modalEl){
      this.modal = new Modal(modalEl, {
        placement: 'bottom-right',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
        closable: true,
        onHide: () => console.log('modal is hidden'),
        onShow: () => console.log('modal is shown'),
        onToggle: () => console.log('modal has been toggled'),
      });
    }
  }


  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }

}
