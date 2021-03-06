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

  getproducts(userId) {

    return this.http.get<any>(appConfig.apiUrl + '/products/getproducts/' + userId)

  }

  deleteoneproduct(productid ) {
   
    return this.http.delete<any>(appConfig.apiUrl + '/products/deleteproduct/' + productid )

  }

  addcsvfile(Files): Observable<any> {

    var userId = localStorage.getItem('userId');

    const formData: any = new FormData();
    const files: Array<File> = Files;
   
    formData.append("uploads", files);
    formData.append("uploads", userId);
    
    return this.http.post<any>(appConfig.apiUrl + '/addcsvfile', formData )

  }

  findproducts(Files) :Observable<any> {

    var userId = localStorage.getItem('userId');

    const formData: any = new FormData();
    const files: Array<File> = Files;
   
    formData.append("uploads", files);
    formData.append("uploads", userId);
    
    return this.http.post<any>(appConfig.apiUrl + '/findproducts', formData )

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

  getallproductbyId(productid , merchantId) {
    return this.http.get<any>(appConfig.apiUrl + '/products/getallproductbyId/' + productid +'/' + merchantId)
  }

  updateprodcutdetail(productdata) {

    return this.http.post<any>(appConfig.apiUrl + '/products/updateprodcutdetail', productdata)

  }

  getAllProductcategories(merchantId) {



    return this.http.post<any>(appConfig.apiUrl + '/products/getAllProductcategories', { 'merchantId': merchantId })


  }


  addproductcategories(catname, merchantId) {
    return this.http.get<any>(appConfig.apiUrl + '/products/addproductcategories/' + catname + '/' + merchantId);

  }

  getProductsRatingDetails(merchantId) {
  
    return this.http.post<any>(appConfig.apiUrl + '/products/getProductsRatingDetails', { 'merchantId': merchantId })

  }
  getProductsRatingDetailsbyid(productid) {

    return this.http.post<any>(appConfig.apiUrl + '/products/getProductsRatingDetailsbyid', { 'productid': productid })

  }

  gettilldetails(tillvalues) {
    
    return this.http.post<any>(appConfig.apiUrl + '/products/gettilldetails', tillvalues)
  }

}