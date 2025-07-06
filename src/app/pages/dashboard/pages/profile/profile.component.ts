import { Component } from '@angular/core';
import { ProfileUserComponent } from "../../../../components/profile-user/profile-user.component";

@Component({
  selector: 'app-profile',
  imports: [ProfileUserComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
