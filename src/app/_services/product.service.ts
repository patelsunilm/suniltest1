import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) { }



  addproduct(productdata) {

    return this.http.post<any>(appConfig.apiUrl + '/products/addproduct', productdata)

  }

  getAllproducts() {

    return this.http.get<any>(appConfig.apiUrl + '/products/getAllproducts')

  }

  deleteoneproduct(productid) {

    return this.http.delete<any>(appConfig.apiUrl + '/products/deleteproduct/' + productid)

  }

  addcsvfile(Files): Observable<any> {

    const formData: any = new FormData();
    const files: Array<File> = Files;
    formData.append("uploads", files);


    return this.http.post<any>(appConfig.apiUrl + '/addcsvfile', formData)

  }

  addproductgallery(Files): Observable<any> {

    const formData: any = new FormData();
    const files: Array<File> = Files;
    for (let i = 0; i < Files.length; i++) {

      formData.append("uploads[]", files[i], files[i]['name']);

    }
    return this.http.post<any>(appConfig.apiUrl + '/uploadproductfiles', formData);
  }

  updateproductgallery(Files): Observable<any> {

    const formData: any = new FormData();
    const files: Array<File> = Files;
    for (let i = 0; i < Files.length; i++) {

      formData.append("uploads[]", files[i], files[i]['name']);

    }
    return this.http.post<any>(appConfig.apiUrl + '/uploadproductfiles', formData);
  }

  getallproductbyId(productid) {

    return this.http.get<any>(appConfig.apiUrl + '/products/getallproductbyId/' + productid)


  }

  updateprodcutdetail(productdata) {

    return this.http.post<any>(appConfig.apiUrl + '/products/updateprodcutdetail', productdata)

  }
}