import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbCollection } from '../../breadcrumb/breadcrumb-collection';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

@Component({
  selector: 'am-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  imports: [MatCardModule, BreadcrumbComponent],
})
export class PageHeaderComponent {
  breadcrumb = input(new BreadcrumbCollection());
}
