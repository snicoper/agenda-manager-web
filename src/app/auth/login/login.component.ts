import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'am-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
