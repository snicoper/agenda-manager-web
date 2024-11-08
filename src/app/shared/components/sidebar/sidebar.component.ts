import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'am-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private layoutService = inject(LayoutService);

  sidebarState = computed(() => this.layoutService.sidebarState());
}
