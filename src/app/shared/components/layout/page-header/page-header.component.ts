import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { BreadcrumbCollection } from '../../breadcrumb/models/breadcrumb-collection.model';

@Component({
  selector: 'am-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  imports: [MatCardModule, BreadcrumbComponent],
})
export class PageHeaderComponent {
  readonly breadcrumb = input(new BreadcrumbCollection());
}
