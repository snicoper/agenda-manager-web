import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BtnBackComponent } from '../../../../shared/components/buttons/btn-back/btn-back.component';
import { PageSimpleComponent } from '../../../../shared/components/pages/page-simple/page-simple.component';

@Component({
  selector: 'am-not-found',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    MatIconModule,
    MatCardModule,
    PageSimpleComponent,
    BtnBackComponent,
    MatButtonModule,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  readonly siteUrls = SiteUrls;
}
