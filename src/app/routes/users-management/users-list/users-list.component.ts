import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-users-management-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  standalone: true,
  imports: [PageHeaderComponent],
})
export class UsersManagementUsersListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
