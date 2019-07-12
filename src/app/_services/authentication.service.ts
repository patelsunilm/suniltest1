import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }


    login(email: string, password: string) {

        return this.http.post<any>(appConfig.apiUrl + '/users/authenticate', { email: email.toLowerCase(), password: password })
            .map(user => {


                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('userId', user._id);
                localStorage.setItem('email', user.email);
                localStorage.setItem('userType', user.userType);
                localStorage.setItem('name', user.name);
                //localStorage.setItem('username', user.username);
                localStorage.setItem('token', user.token);

                return user;
            });
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('userType');
        localStorage.removeItem('name');
        //  localStorage.removeItem('username');
    }


}