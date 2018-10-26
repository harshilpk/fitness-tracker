import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';
import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(/*private authService: AuthService */ private store: Store<fromRoot.State>, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {

  //  if (/*this.authService.isAuth()*/ ) {
  //    return true;
  //  } else {
  //   this.router.navigate(['/login']);
  //  }
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));

  }

  canLoad(_route: Route) {

  //   if (this.authService.isAuth()) {
  //     return true;
  //   } else {
  //    this.router.navigate(['/login']);
  //   }
  //  }
  return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }
}
