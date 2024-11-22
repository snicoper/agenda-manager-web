import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { ThemeManagerService } from './core/services/theme-manager.service';

@Component({
    selector: 'am-root',
    imports: [RouterOutlet, MatSlideToggleModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  private themeManagerService = inject(ThemeManagerService);

  handleChange() {
    this.themeManagerService.toggle();
  }
}
