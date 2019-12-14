import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isStorage: boolean;
  public apiUrl = 'http://localhost:3000/api';
  public currentDate: Date;
  public currentDateUnix: number;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.isStorage = localStorageService.isLocalStorageAvailable();
  }

  login(params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post(`${this.apiUrl}/users/login`, params, httpOptions)
      .pipe(
        map(response => {
          if (response["success"]) {
            if (this.isStorage) {
              this.localStorageService.setData('userData', response["user"]);
              this.localStorageService.setData('token', response["token"]);
              this.localStorageService.setData('isLoggedin', 'true');
            }
          }
          return response;
        })
      );
  }

  // /**
  //  * Check token of user
  //  * @returns boolean - return true if token is valid
  //  */
  // public isAuthenticated(): boolean {
  //   if (!this.localStorageService.getData('token')) {
  //     return false;
  //   }
  //   try {
  //     const helper = new JwtHelperService();
  //     const token = this.localStorageService.getData('token');
  //     const tokenPayload = helper.decodeToken(token);
  //     this.currentDate = new Date();
  //     this.currentDateUnix = this.currentDate.getTime();

  //     this.currentDateUnix = (Math.floor(this.currentDateUnix / 1000) - 30);
  //     if (this.currentDateUnix > tokenPayload.exp) {
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return false;
  //   }
  // }
}
