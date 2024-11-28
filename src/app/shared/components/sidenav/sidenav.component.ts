import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'am-sidenav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private layoutService = inject(LayoutService);

  sidebarState = computed(() => this.layoutService.sidebarState());
}
