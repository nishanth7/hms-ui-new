import { Injectable, inject } from '@angular/core';
import { AuthService, LoginService, User } from '@core/authentication';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { switchMap, tap } from 'rxjs';
import { Menu, MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly permissonsService = inject(NgxPermissionsService);
  private readonly rolesService = inject(NgxRolesService);
  private readonly loginService = inject(LoginService);
  public user: User;

  constructor() {
    this.user = {};
  }

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load() {
    return new Promise<void>((resolve, reject) => {
      this.authService
        .change()
        .pipe(
          tap(user => this.setPermissions(user)),
          switchMap(() => this.authService.menu()),
          tap(menu => this.setMenu(menu))
        )
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
    this.authService.permissions().subscribe(res => {
      console.log(res);
    });
  }

  private setPermissions(user: User) {
    // In a real app, you should get permissions and roles from the user information.r
    this.user = user;
    //  const permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
    //  this.permissonsService.loadPermissions(permissions);
    //  this.rolesService.flushRoles();
    //  this.rolesService.addRoles({ MANAGER: permissions });

    // Tips: Alternatively you can add permissions with role at the same time.
    // this.rolesService.addRolesWithPermissions({ ADMIN: permissions });
    this.rolesService.flushRoles();
    this.loginService.permissions().subscribe((res: any) => {
      console.log(res);
      // const role: keyof typeof res = user['role'];
      const role = user['role'];
      const permissions = res[role];
      this.permissonsService.loadPermissions(permissions);
      this.rolesService.flushRoles();
      if (role && permissions) {
        this.rolesService.addRolesWithPermissions({ [role]: permissions });
      }
      //  this.rolesService.addRoles({ role: permissions });
    });
  }
}
