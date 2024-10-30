import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'am-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private layoutService = inject(LayoutService);

  navbarState = computed(() => this.layoutService.navbarState());
}
