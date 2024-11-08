import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../core/services/layout.service';
import { PageBaseComponent } from '../../../shared/components/pages/page-base/page-base.component';

@Component({
  selector: 'am-login',
  standalone: true,
  imports: [CommonModule, PageBaseComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private layoutService = inject(LayoutService);

  handleToggleNavbar() {
    this.layoutService.navbarToggle();
  }
}
