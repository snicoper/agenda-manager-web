import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../../../core/modules/auth/services/auth.service';
import { LayoutService } from '../services/layout.service';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'am-sidebar',
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatSidenavModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    SidebarMenuComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);

  readonly sidebarState = this.layoutService.layoutState.sidebarState;

  readonly email = this.authService.getEmail();
}
