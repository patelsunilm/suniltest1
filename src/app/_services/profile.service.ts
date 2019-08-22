import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as $ from 'jquery';
import { appConfig } from '../app.config';

@Injectable()
export class ProfileService {
    constructor(private http: HttpClient) { }


    uploadLogoImage(Files): Observable<any> {

        const formData: any = new FormData();
        const files: Array<File> = Files;
        for (let i = 0; i < Files.length; i++) {

            formData.append("uploads[]", files[i], files[i]['name']);

        }
        return this.http.post<any>(appConfig.apiUrl + '/uploadproductfiles', formData);
    }


    getprofileInfo(userId) {

        return this.http.get<any>(appConfig.apiUrl + '/profile/getprofileInfo/' + userId)
    }

    updateprofile(profiledata) {

        return this.http.post<any>(appConfig.apiUrl + '/profile/updateprofile', profiledata)
            .map(user => {
                console.log(user)
                localStorage.setItem('name', user.name);
                localStorage.setItem('myprofilelogoimage', user.image);

                $('#CurrencyChnage').fadeOut('slow').load('toolbar.component.ts').fadeIn('slow');
                return user;
            });
    }

    getcountries() {

        return this.http.get<any>(appConfig.apiUrl + '/profile/getcountries')

    }


    getstates(countrieid) {



        return this.http.post<any>(appConfig.apiUrl + '/profile/getstates', { 'countrieId': countrieid })

    }


    getcity(stateid) {

        return this.http.post<any>(appConfig.apiUrl + '/profile/getcity', { 'stateId': stateid })

    }
}