import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBaseComponent } from '../../shared/components/pages/page-base/page-base.component';

@Component({
  selector: 'am-login',
  standalone: true,
  imports: [CommonModule, PageBaseComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
