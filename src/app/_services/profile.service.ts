import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class ProfileService {
    constructor(private http: HttpClient) { }

    getprofileInfo(userId) {
        return this.http.get<any>(appConfig.apiUrl + '/profile/getprofileInfo/' + userId)
    }

    updateprofile(profiledata) {
       
        return this.http.post<any>(appConfig.apiUrl + '/profile/updateprofile', profiledata)
    }


}