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

@Injectable()
export class AuthService {
  // private user: User;
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService,
              private matSnackBar: MatSnackBar, private uiService: UIService) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {

        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);

      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.isAuthenticated = false;
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.uiService.loadingStateChanged.next(false);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
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
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.uiService.loadingStateChanged.next(false);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
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

  isAuth() {
    // return this.user != null;
    return this.isAuthenticated;
  }


}
