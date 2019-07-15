import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class ChangePasswordService {
    constructor(private http: HttpClient) { }

    passwordmatch(passworddata) {
       
        return this.http.post<any>(appConfig.apiUrl + '/password/passwordmatch', {'userId': localStorage.getItem('userId'), 'passworddata': passworddata});
      }

}