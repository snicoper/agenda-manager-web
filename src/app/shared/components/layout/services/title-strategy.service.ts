import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { AppEnvironment } from '../../../../core/config/app-environment';

@Injectable({ providedIn: 'root' })
export class TitleStrategyService extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);

    if (title !== undefined) {
      this.title.setTitle(`${AppEnvironment.SiteName} | ${title}`);
    }
  }
}
