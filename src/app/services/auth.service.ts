import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
// import {Plugins} from '@capacitor/core';
import { Storage } from '@ionic/storage';
const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
// const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
      private storage: Storage,
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
          return from(this.storage.get(TOKEN_KEY));
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
    console.log('credentials', credentials);
    // Normally make a POST request to your APi with your login credentials
    if (credentials.email !== 'saimon@devdactic.com' || credentials.pw !== '123') {
      return of(null);
    }

    return this.http.get('https://randomuser.me/api/').pipe(
        take(1),
        map(res => {
          console.log('res res', res);
          // Extract the JWT, here we just fake it
          return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiU2ltb24iLCJsYXN0X25hbWUiOiJHcmltbSIsImVtYWlsIjoic2FpbW9uQGRldmRhY3RpYy5jb20ifQ.4LZTaUxsX2oXpWN6nrSScFXeBNZVEyuPxcOkbbDVZ5U`;
        }),
        switchMap(token => {
          console.log('token', token);
          const decoded = helper.decodeToken(token);
          console.log('decoded', decoded);
          this.userData.next(decoded);
          const storageObs = from(this.storage.set(TOKEN_KEY, token));
          console.log('storageObs', storageObs);
          console.log('storage location', this.storage.set(TOKEN_KEY, token));
          return storageObs;
        })
    );
  }

  getUser() {
    return this.userData.getValue();
  }

  logout() {
    this.storage.remove(TOKEN_KEY)
    .then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }
}
