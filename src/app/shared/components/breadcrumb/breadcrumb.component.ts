import { Component, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SiteUrls } from '../../../core/config/site-urls';
import { BreadcrumbCollection } from './models/breadcrumb-collection.model';

@Component({
  selector: 'am-breadcrumb',
  imports: [RouterLink, MatButtonModule, MatIcon],
  styleUrl: './breadcrumb.component.scss',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {
  breadcrumb = model(new BreadcrumbCollection());

  ngOnInit(): void {
    this.breadcrumb().unshift({
      label: '',
      link: SiteUrls.home,
      icon: 'home',
      active: true,
    });
  }
}
