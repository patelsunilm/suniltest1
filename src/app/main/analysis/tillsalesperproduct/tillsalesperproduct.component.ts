import { Component, OnInit, NgZone, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import {MatSnackBar} from '@angular/material';
import { ProductService } from '../../../_services/index';
import { validateBasis } from '@angular/flex-layout';



@Component({
  selector: 'app-tillsalesperproduct',
  templateUrl: './tillsalesperproduct.component.html',
  styleUrls: ['./tillsalesperproduct.component.scss'],
  animations: fuseAnimations
})
export class TillsalesperproductComponent implements OnInit {
  form: FormGroup;
  productname : any;
  dataSource : any;
  showgraph : any;

  constructor(private ProductService : ProductService ,public snackBar: MatSnackBar, private _formBuilder: FormBuilder) {
    
   
   }

  ngOnInit() {
  
    this.form = this._formBuilder.group({
      startdate: ['', Validators.required],
      endDate: ['', Validators.required],
      productname : ['' ,Validators.required]

    });

    var merchantId = localStorage.getItem('userId');
    this.ProductService.getproducts(merchantId)
      .subscribe(
        data => {

        this.productname = data;
     
      }, error => {
          console.log(error);
        });
  }

  gettillmovementdetails() {
    
    var start = this.form.value.startdate._d;
    var end = this.form.value.endDate._d;
    this.form.value.endDate = end;
    this.form.value.startdate = start;
    this.ProductService.gettilldetails(this.form.value)
    .subscribe(
      data => {
         
       if(data == '' || data == undefined || data == "undefined" || data == null) {
 
        
       } else {

        this.showgraph = "0";
        var tilldetails  = data;
       var till = [];
       tilldetails.forEach(element => {
        element.value = element.totalQty.toString();
        element.label = element._id.day.toString();
        till.push(element)
      });
    
      this.dataSource = {
        "chart": {
          "caption": "Till sales per product",
          "showValues": "1",
          "showPercentInTooltip": "0",
          "numberPrefix": "",
          "enableMultiSlicing": "1",
          "theme": "fusion"
        },
       "data": till
     
      };
    }
    }, error => {
        console.log(error);
      });
    
  }

}
