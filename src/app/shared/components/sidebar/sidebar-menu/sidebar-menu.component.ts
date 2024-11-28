import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserStorageService } from '../../../../core/services/browser-storage.service';
import { BrowserStorageKey } from '../../../../core/types/browser-storage-key.enum';
import { SystemRoles } from '../../../../core/types/system-roles';
import { RequiredRoleDirective } from '../../../directives/required-role.directive';
import { SidenavMenu, SidenavMenuItem, SidenavMenus } from './sidenav-menu';

@Component({
  selector: 'am-sidebar-menu',
  imports: [MatSidenavModule, MatExpansionModule, MatIconModule, MatListModule, RequiredRoleDirective],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  private readonly browserStorageService = inject(BrowserStorageService);

  private readonly sidenavMenu: SidenavMenu;

  readonly roles = SystemRoles;

  constructor() {
    this.sidenavMenu = this.browserStorageService.getParse<SidenavMenu>(BrowserStorageKey.Sidenav) ?? SidenavMenus;
  }

  stateSidebarMenu(sidebarMenu: string): boolean {
    const item = this.getSidenavMenuItem(sidebarMenu);

    return item ? item.open : false;
  }

  handleOpenExpansionPanel(name: string): void {
    const sidebarMenuItem = this.getSidenavMenuItem(name);

    if (!sidebarMenuItem) {
      return;
    }

    sidebarMenuItem.open = true;
    this.saveSidenavState();
  }

  handleClosedExpansionPanel(name: string): void {
    const sidebarMenuItem = this.getSidenavMenuItem(name);

    if (!sidebarMenuItem) {
      return;
    }

    sidebarMenuItem.open = false;
    this.saveSidenavState();
  }

  private getSidenavMenuItem(name: string): SidenavMenuItem | undefined {
    const sidebarMenuItem = this.sidenavMenu.find((item: SidenavMenuItem) => item.name === name);

    return sidebarMenuItem;
  }

  private saveSidenavState(): void {
    this.browserStorageService.setObject(BrowserStorageKey.Sidenav, this.sidenavMenu);
  }
}
