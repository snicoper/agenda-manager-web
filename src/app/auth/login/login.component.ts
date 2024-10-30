import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageSimpleComponent } from '../../shared/components/pages/page-simple/page-simple.component';

@Component({
  selector: 'am-login',
  standalone: true,
  imports: [CommonModule, PageSimpleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
