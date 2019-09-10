import { Component, OnInit } from '@angular/core';
import {  OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer } from '@angular/platform-browser';
import $ from "jquery";
import { tillManagementService } from '../../../_services/index';
import {ProductService} from '../../../_services/index';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.scss'],
  animations: fuseAnimations
})
export class UpdateproductComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  form: FormGroup;

  urls: Array<File> =[];
  filesToUpload: Array<File> = [];
  image : any;
  returnUrl: string;
  Primary : any;
  Secondary: any;
  Tertiary: any;
  constructor(private ProductService : ProductService,  private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer ,private tillManagementService : tillManagementService ) { }

  ngOnInit() {
 
    this.form = this._formBuilder.group({
      image: [''],
      productname: ['', Validators.required],
      costprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      markup: ['', Validators.required],
      sellingprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      date: ['', Validators.required],
      tilltype: ['', Validators.required],
      stocklevel: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      movestock : [''],
      movestockinputvalue : ['']
  });
 
  this.route.params.subscribe(params => { 

    this.ProductService.getallproductbyId(params.id).subscribe(data => {
      this.image = data.image
      this.form = this._formBuilder.group({
        id:[data._id],
        image: [ this.image],
        productname : [data.productname],
        costprice: [data.costprice,Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        markup : [data.markup ,Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        sellingprice : [data.sellingprice,Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        date : [data.date],
        tilltype : [data.tilltype],
        stocklevel: [data.stocklevel,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    });
    })

  })


  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
  
  var merchantId = localStorage.getItem('userId');
  this.tillManagementService.getTillManagementDetails(merchantId)
    .subscribe(
      data => {
        if (data == '' || data == null || data == 'null') {

        } else {
        
          this.Primary = data;  
          console.log('this primary');
          console.log(data);
        

        }
      },
      error => {
        // console.log("error");
      });






  }
  
  fileChangeEvent(fileInput: any, index) {

    var imagefiles = fileInput.target.files;
    if (fileInput.target.files && fileInput.target.files[0]) {
      var regex = new RegExp("(.*?)\.(jpg|jpeg|png|raw|tiff)$");

      if (!(regex.test(fileInput.target.value.toLowerCase()))) {
          fileInput.target.value = ''
        this.snackBar.open('Please select correct file format', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
     
      }else{

        var filesAmount = fileInput.target.files.length;

        var testreader = new FileReader();
        testreader.onload = (fileInput: any) => {
  
  
          this.urls[index] = fileInput.target.result;
          this.filesToUpload.push(imagefiles[0]);
        }
  
        testreader.readAsDataURL(fileInput.target.files[0]);

      }
    }
  }


close(urls, event, index, i) {

 

  urls.splice(i, 1);
  var temp = new Array<File>();
  for (var j = 0; j < this.filesToUpload.length; j++) {
    if (j != i) {
      temp.push(this.filesToUpload[j]);
    }
  }
  this.filesToUpload = temp;

}


updateproduct() {


if(this.filesToUpload.length > 0) {
  
  
  var data = this.filesToUpload.slice(-1);

  this.ProductService.updateproductgallery(data).subscribe(data => {
   
 this.form.value.image = data[0].s3url
 this.form.value.sellingprice = ($("#selling").val());
this.ProductService.updateprodcutdetail(this.form.value).subscribe(data => {
 
  this.snackBar.open('Product update success fully', '', {
    duration: 3000,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
  });
  this.router.navigate([this.returnUrl]);

}, error => {
  console.log(error);

})

  })
} else {

  this.form.value.sellingprice = ($("#selling").val());
  this.ProductService.updateprodcutdetail(this.form.value).subscribe(data => {
 
    this.snackBar.open('Product update success fully', '', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  
    this.router.navigate([this.returnUrl]);
  }, error => {
    console.log(error);
  
  })
}

return false

}


netamount(i) {

  var costprice = ($("#costprice").val()) ? parseFloat($("#costprice").val()) : 0;
  var markupprice = ($("#markup").val()) ? parseFloat($("#markup").val()) : 0;
  
  var sellingprice = (costprice + markupprice)
   $("#selling").val(sellingprice)
    
  // this.price = $("#selling" + i).val(sellingprice)
  
}
}
