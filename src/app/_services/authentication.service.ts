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

                if (user.string == 'You cannot logged in as your Status is off.') {

                }
                else {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('userId', user._id);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('userType', user.userType);
                    localStorage.setItem('name', user.name);
                    localStorage.setItem('myprofilelogoimage', user.image);
                    localStorage.setItem('token', user.token);
                }
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
        localStorage.removeItem('googleid');
        localStorage.removeItem('authToken');
        localStorage.removeItem('myprofilelogoimage');
    }


    addsignupuser(userdata) {
        return this.http.post<any>(appConfig.apiUrl + '/users/addsignupuser', userdata)
    }


    addsecretValuedata(_id, secretanswer) {
        return this.http.post<any>(appConfig.apiUrl + '/users/addsecretValuedata', { '_id': _id, 'secretanswer': secretanswer })

    }


    updateipaddress(data) {
       
        return this.http.post<any>(appConfig.apiUrl + '/users/updateipaddress', data)
    }

    submitgoogledetails(googledata) {
        return this.http.post<any>(appConfig.apiUrl + '/users/submitgoogledetails', googledata)
            .map(user => {

                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('userId', user._id);
                localStorage.setItem('email', user.email);
                localStorage.setItem('userType', user.userType);
                localStorage.setItem('name', user.name);
                localStorage.setItem('googleid', user.googleid);
                localStorage.setItem('authToken', user.authToken);
                localStorage.setItem('myprofilelogoimage', user.image);
                localStorage.setItem('token', user.token);

                return user;
            });


    }


    getmerchantcategories() {
        

        return this.http.get<any>(appConfig.apiUrl + '/users/getmerchantcategories')

    }
}