import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-card-component',
  imports: [LucideAngularModule],
  templateUrl: './card-component.component.html',
  styleUrl: './card-component.component.css',
})
export class CardComponentComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
}
