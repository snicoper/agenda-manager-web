import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BladeComponent } from '../../blade/blade.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'am-page-base',
  imports: [CommonModule, NavbarComponent, SidebarComponent, BladeComponent],
  templateUrl: './page-base.component.html',
  styleUrl: './page-base.component.scss',
})
export class PageBaseComponent implements OnInit {
  private readonly router = inject(Router);
  isLeaving = false;

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isLeaving = false;
    });
  }

  prepareRouteTransition(): Promise<boolean> {
    this.isLeaving = true;

    return new Promise((resolve) => setTimeout(resolve, 300));
  }
}
