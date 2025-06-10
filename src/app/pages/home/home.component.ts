import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavComponent } from "../../shared/nav/nav.component";
import { CardComponentComponent } from '../../components/card-component/card-component.component';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, NavComponent, CardComponentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
