import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../../core/auth/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'am-sidebar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatSidenavModule, MatDividerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);

  sidebarState = computed(() => this.layoutService.layoutState().sidebarState);

  readonly email = this.authService.getEmail();
}
