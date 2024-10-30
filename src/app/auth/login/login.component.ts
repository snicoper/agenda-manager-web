import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PageBaseComponent } from '../../shared/components/pages/page-base/page-base.component';
import { LayoutService } from '../../shared/services/layout.service';

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
