import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { ThemeStateService } from './shared/components/layout/services/theme.state.service';

@Component({
  selector: 'am-root',
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private themeStateService = inject(ThemeStateService);

  handleChange(): void {
    this.themeStateService.toggle();
  }
}
