import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BladeService } from './services/blade.service';

@Component({
  selector: 'am-blade',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './blade.component.html',
  styleUrl: './blade.component.scss',
})
export class BladeComponent {
  bladeService = inject(BladeService);
}
