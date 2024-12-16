import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, input } from '@angular/core';
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

  closeOnContainerClick = input(true);
  closeOnEscapeKey = input(true);

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.bladeService.bladeState().isVisible && this.closeOnEscapeKey()) {
      this.bladeService.hide();
    }
  }

  handleContainerClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && this.closeOnContainerClick()) {
      this.bladeService.hide();
    }
  }

  handleKeyDown(): void {
    // Método vacío solo para satisfacer el linter
  }
}
