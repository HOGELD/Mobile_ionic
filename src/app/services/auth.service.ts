import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import {Plugins} from '@capacitor/core';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
      private http: HttpClient,
      private plt: Platform,
      private router: Router
  ) {
    this.loadStoredToken();
  }

  loadStoredToken() {
    const platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
        switchMap(() => {
          return from(Storage.get({key: TOKEN_KEY}));
        }), map (token => {
          if (token) {
            // @ts-ignore
            const decoded = helper.decodeToken( token );
            this.userData.next(decoded);
            return true;
          } else {
            return null;
          }
        })
    );
  }

  login(credentials: {email: string, pw: string }) {
    // Normally make a POST request to your APi with your login credentials
    if (credentials.email != 'saimon@devdactic.com' || credentials.pw != '123') {
      return of(null);
    }

    return this.http.get('https://randomuser.me/api/').pipe(
        take(1),
        map(res => {
          // Extract the JWT, here we just fake it
          return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiU2ltb24iLCJsYXN0X25hbWUiOiJHcmltbSIsImVtYWlsIjoic2FpbW9uQGRldmRhY3RpYy5jb20ifQ.4LZTaUxsX2oXpWN6nrSScFXeBNZVEyuPxcOkbbDVZ5U`;
        }),
        switchMap(token => {
          const decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          Storage.set({
            key: 'user',
            value: JSON.stringify({
              id: 1,
              name: 'Max'
            })
          })
          const storageObs = from(Storage.set({key: TOKEN_KEY, value: token}));
          return storageObs;
        })
    );
  }

  getUser() {
    return this.userData.getValue();
  }

  logout() {
    Storage.remove({ key: TOKEN_KEY})
    .then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }
}
