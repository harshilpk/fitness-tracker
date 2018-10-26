import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { subscribeOn } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  // private user: User;
  // private isAuthenticated = false;
  // authChange = new Subject<boolean>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService,
              private matSnackBar: MatSnackBar, private uiService: UIService, private store: Store<fromRoot.State>) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {

        if (user) {
          // this.isAuthenticated = true;
          // this.authChange.next(true);
          this.store.dispatch(new Auth.SetAuthenticated());
          this.router.navigate(['/training']);

      } else {
        this.trainingService.cancelSubscriptions();
        // this.authChange.next(false);
        this.store.dispatch(new Auth.SetUnauthenticated());
        // this.isAuthenticated = false;
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
    })
    .catch(error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar(error.message, null, 3000);
      // this.matSnackBar.open(error.message, null, {
      //   duration: 3000
      // });
    });
    // this.authSuccessfully();
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
    })
    .catch(error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar(error.message, null, 3000);
      // this.matSnackBar.open(error.message, null, {
      //   duration: 3000
      // });
    });
    // this.authSuccessfully();
    // this.authSuccessfully();
  }

  logOut() {
    // this.user = null;
    this.afAuth.auth.signOut();

  }

  // getUser() {
  //   return { ...this.user };
  // }

  // isAuth() {
  //   // return this.user != null;
  //   return this.isAuthenticated;
  // }


}
