import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BtnBackComponent } from '../../../../shared/components/buttons/btn-back/btn-back.component';
import { PageSimpleComponent } from '../../../../shared/components/pages/page-simple/page-simple.component';

@Component({
  selector: 'am-forbidden',
  templateUrl: './forbidden.component.html',
  standalone: true,
  imports: [RouterLink, PageSimpleComponent, BtnBackComponent],
})
export class ForbiddenComponent {
  readonly siteUrls = SiteUrls;
}
