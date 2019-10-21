import { Component, OnDestroy, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../_services/index';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ProductService } from '../../../app/_services/product.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class QrcodeComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
 
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  form: FormGroup;
  image : any;
  catname : any;
  productid : any;
  constructor( private ProductService: ProductService,private _fuseConfigService: FuseConfigService, private http: HttpClient, public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder, private AuthenticationService: AuthenticationService, private route: ActivatedRoute,
    private router: Router, ) {

     // Configure the layout
     this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
    }

  ngOnInit() {
  
    this.form = this._formBuilder.group({
      image: [''],
      productname: ['', Validators.required],
      costprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      markup: ['', Validators.required],
      sellingprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      date: ['', Validators.required],
      tilltype: ['', Validators.required],
      tilltypename: ['', Validators.required],
      stocklevel: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      movestock: [''],
      movestockinputvalue: [''],
      catname: ['']
    });


    this.route.params.subscribe(params => {
      
      this.ProductService.getallproductbyId(params.id).subscribe(data => {   
       
        this.image = data.image;
       
        
        this.productid = data.productcatid;
       
        this.form = this._formBuilder.group({
          id: [data._id],
          image: [this.image],
          productname: [data.productname],
          costprice: [data.costprice],
          markup: [data.markup],
          sellingprice: [data.sellingprice],
          date: [data.date],
          tilltype: [data.tilltype],
          tilltypename: [data.tillTypeName],
          stocklevel: [data.stocklevel],
          catname: ['']
        });
      })
      var merchantId = localStorage.getItem('userId');
      this.ProductService.getAllProductcategories(merchantId)
        .subscribe(
          data => {
          
            data.data.forEach(element => {
            if(this.productid == element.productCatId){
              this.catname= element.catName;

            }

            });
          },
          error => {
            console.log(error);
  
          });
    })

  }

}
