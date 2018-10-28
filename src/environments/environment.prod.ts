import { SecretKey } from '../../SecretKey/secretapikey';

const secretKey = new SecretKey;

export const environment = {
  production: true,
  firebase: {
    apiKey: this.secretKey.getApiKey(),
    authDomain: 'ng-fitness-tracker-f3fee.firebaseapp.com',
    databaseURL: 'https://ng-fitness-tracker-f3fee.firebaseio.com',
    projectId: 'ng-fitness-tracker-f3fee',
    storageBucket: 'ng-fitness-tracker-f3fee.appspot.com',
    messagingSenderId: '206992352164'
  }
};
