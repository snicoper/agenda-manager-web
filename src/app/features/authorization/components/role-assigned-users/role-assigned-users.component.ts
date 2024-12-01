import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'am-role-assigned-users',
  imports: [],
  templateUrl: './role-assigned-users.component.html',
  styleUrl: './role-assigned-users.component.scss',
})
export class RoleAssignedUsersComponent implements OnInit {
  roleId = input.required<string>();

  ngOnInit(): void {
    console.log('ngOnInit called');
  }
}
