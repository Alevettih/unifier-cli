import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'main',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  toggleSidebar: boolean = false;

  constructor(private auth: AuthService) {}

  get isAuthenticated$(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }
}
