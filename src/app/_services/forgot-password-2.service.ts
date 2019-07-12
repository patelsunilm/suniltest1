import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class ForgotPasswordService {
    constructor(private http: HttpClient) { }


    sendlink(sendlinkdata) {
        return this.http.post<any>(appConfig.apiUrl + '/forgot-password-2/sendlink', sendlinkdata);
    }

    resetpassword(resetpassworddata) {

        return this.http.post<any>(appConfig.apiUrl + '/forgot-password-2/resetpassword', resetpassworddata);
      }
}