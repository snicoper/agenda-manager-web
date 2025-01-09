import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BladeService } from './services/blade.service';

/**
 * Known Issue: Material UI Initialization in Dynamic Component Loading
 *
 * When loading Material UI components dynamically (especially with nested structures
 * like blades + tabs), there can be timing issues with Material's initialization.
 *
 * The issue manifests as:
 * - Incorrect initial styling
 * - Components appearing unstyled momentarily
 * - Style flickering on first render
 *
 * Solution:
 * Adding a setTimeout in ngOnInit forces an additional change detection cycle,
 * allowing Material to complete its initialization before the component fully renders.
 */
@Component({
  selector: 'am-blade',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './blade.component.html',
  styleUrl: './blade.component.scss',
})
export class BladeComponent implements OnDestroy {
  readonly bladeService = inject(BladeService);

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.bladeService.bladeState.isVisible() && this.bladeService.bladeState.options().closeOnEscapeKey) {
      this.bladeService.close();
    }
  }

  handleContainerClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && this.bladeService.bladeState.options().closeOnOutsideClick) {
      this.bladeService.close();
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  handleKeyDown(): void {
    // Método vacío solo para satisfacer el linter.
  }
}
