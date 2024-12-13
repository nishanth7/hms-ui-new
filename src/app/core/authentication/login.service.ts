import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { Menu } from '@core';
import { Token, User } from './interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/v1/auth/login', { email: username, password, rememberMe });
  }

  register(username: any, password: any, rememberMe = false) {
    return this.http.post<Token>('/v1/auth/register', { email: username, password });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    return this.http.get<User>('/v1/users/profile');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/v1/users/menu').pipe(map(res => res.menu));
  }

  permissions() {
    return this.http.get<{ permissions: any[] }>('/v1/users/permissions').pipe(map(res => res));
  }
}
