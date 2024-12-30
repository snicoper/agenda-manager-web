import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RoleSelectedStateService } from '../../services/state/role-selected-state.service';
import { RoleAssignedUsersComponent } from '../role-assigned-users/role-assigned-users.component';
import { RoleAvailableUsersComponent } from '../role-available-users/role-available-users.component';

@Component({
  selector: 'am-role-user-assignments-tab',
  imports: [MatTabsModule, RoleAssignedUsersComponent, RoleAvailableUsersComponent],
  templateUrl: './role-user-assignments-tab.component.html',
  styleUrl: './role-user-assignments-tab.component.scss',
})
export class RoleUserAssignmentsTabComponent {
  private readonly roleSelectedStateService = inject(RoleSelectedStateService);

  readonly roleState = this.roleSelectedStateService.state;
}
