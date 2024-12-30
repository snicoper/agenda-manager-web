import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth/services/auth.service';
import { AllPermissions } from '../../../../core/modules/auth/types/all-permissions.type';
import { RequiredPermissionDirective } from '../../../directives/required-permission.directive';
import { RequiredRoleDirective } from '../../../directives/required-role.directive';
import { NavToolbarData } from './interfaces/nav-toolbar-data.interface';

@Component({
  selector: 'am-nav-toolbar',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatBadgeModule,
    RequiredRoleDirective,
    RequiredPermissionDirective,
  ],
  templateUrl: './nav-toolbar.component.html',
  styleUrl: './nav-toolbar.component.scss',
})
export class NavToolbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  data = input.required<NavToolbarData>();
  animationDuration = model<string>('225ms');
  selectedIndex = model<number>(0);

  readonly themePalette = 'primary';

  constructor() {
    this.loadListeners();
  }

  ngOnInit(): void {
    this.setupTabNavigation();
  }

  handleSelectedIndexChange(index: number): void {
    if (this.isValidIndex(index)) {
      this.updateQueryParams(index);
    }
  }

  hasPermission(permissions: AllPermissions | AllPermissions[] | undefined): boolean {
    if (!permissions) {
      return true;
    }

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];

    return permissionsArray.every((permission) => this.authService.hasPermission(permission));
  }

  private loadListeners(): void {
    this.selectedIndex.subscribe((index) => this.handleSelectedIndexChange(index));
  }

  private setupTabNavigation(): void {
    this.route.queryParams
      .pipe(
        map((params) => {
          const tabParam = params['tab'];

          if (!tabParam) {
            return 0;
          }

          // Intentar convertir a número para navegación por índice.
          const numericIndex = Number(tabParam);

          if (!isNaN(numericIndex) && this.isValidIndex(numericIndex)) {
            return numericIndex;
          }

          // Buscar por nombre si no es un índice válido.
          return this.findTabIndexByName(tabParam);
        }),
        distinctUntilChanged(),
      )
      .subscribe((index) => {
        this.selectedIndex.set(index);
        this.updateQueryParams(index);
      });
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.data().tabs.length;
  }

  private findTabIndexByName(name: string): number {
    const foundTab = this.data().tabs.find((tab) => tab.name === name);

    return foundTab?.index ?? 0;
  }

  private updateQueryParams(index: number): void {
    const currentTab = this.data().tabs[index];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: currentTab.name },
      queryParamsHandling: 'merge',
    });
  }
}
