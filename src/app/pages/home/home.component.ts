import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavComponent } from "../../shared/nav/nav.component";
import { CardComponentComponent } from '../../components/card-component/card-component.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, NavComponent, CardComponentComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
