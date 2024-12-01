import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'am-role-available-users',
  imports: [],
  templateUrl: './role-available-users.component.html',
  styleUrl: './role-available-users.component.scss',
})
export class RoleAvailableUsersComponent implements OnInit {
  roleId = input.required<string>();

  ngOnInit(): void {
    console.log('ngOnInit called 1');
  }
}
