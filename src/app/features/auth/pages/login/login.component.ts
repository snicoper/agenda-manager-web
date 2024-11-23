import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { BadRequest } from '../../../../core/models/bad-request';
import { PageSimpleComponent } from '../../../../shared/components/pages/page-simple/page-simple.component';

@Component({
  selector: 'am-login',
  imports: [CommonModule, PageSimpleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private badRequest: BadRequest | undefined;

  constructor() {
    this.buildForm();
  }

  handleSubmit(): void {
    // ...
  }

  private buildForm(): void {
    this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
