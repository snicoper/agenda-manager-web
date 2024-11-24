import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBaseComponent } from '../../../shared/components/pages/page-base/page-base.component';

@Component({
  selector: 'am-home',
  imports: [CommonModule, PageBaseComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
