import { Component, model, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SiteUrls } from '../../../core/config/site-urls';
import { BreadcrumbCollection } from './breadcrumb-collection';

@Component({
  selector: 'am-breadcrumb',
  imports: [RouterLink, MatIcon],
  styleUrl: './breadcrumb.component.scss',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {
  breadcrumb = model(new BreadcrumbCollection());

  ngOnInit(): void {
    this.breadcrumb().unshift({
      text: '',
      link: SiteUrls.home,
      icon: 'home',
      active: true,
    });
  }
}
