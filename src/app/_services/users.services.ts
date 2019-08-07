import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class UsersService {
   
    constructor(private http: HttpClient) { }



    GetallUsersDetails() {

        return this.http.get<any>(appConfig.apiUrl + '/appusers/GetallUsersDetails')
    }

    deleteappuser(userid) {

        return this.http.delete<any>(appConfig.apiUrl + '/appusers/deleteappuser/' + userid)

    }

    getuserbyId(userid) {

        return this.http.get<any>(appConfig.apiUrl + '/appusers/getuserbyId/' + userid)

    }
   
    updateuserprofile(Files):Observable<any> {
      
        const formData: any = new FormData();
        const files: Array<File> = Files;
        for (let i = 0; i < Files.length; i++) {
    
          formData.append("uploads[]", files[i], files[i]['name']);
    
        }
        return this.http.post<any>(appConfig.apiUrl + '/uploadproductfiles', formData);
      
    }


    updateuserdetails(userdata) {

        return this.http.post<any>(appConfig.apiUrl + '/appusers/updateuserdetails', userdata)

    }
}