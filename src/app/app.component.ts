import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { ThemeState } from './shared/components/layout/services/states/theme.state';

@Component({
  selector: 'am-root',
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private themeState = inject(ThemeState);

  handleChange(): void {
    this.themeState.toggle();
  }
}
