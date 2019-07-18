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

  
  constructor(private ProductService : ProductService,  private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
 
    this.form = this._formBuilder.group({
      image: [''],
      productname : [''],
      costprice: [''],
      markup : [''],
      sellingprice : [''],
      date : [''],
      tilltype : [''],
      stocklevel: ['']
  });
 
  this.route.params.subscribe(params => { 
    console.log(params.id);

    this.ProductService.getallproductbyId(params.id).subscribe(data => {
   
      this.form = this._formBuilder.group({
        image: [''],
        productname : [data.productname],
        costprice: [data.costprice],
        markup : [data.markup],
        sellingprice : [data.sellingprice],
        date : [data.date],
        tilltype : [data.tilltype],
        stocklevel: [data.stocklevel]
    });
    })

  })



  }
  fileChangeEvent(fileInput: any,index) {

    var imagefiles = fileInput.target.files;
    if (fileInput.target.files && fileInput.target.files[0]) {
        var filesAmount = fileInput.target.files.length;
     
            var testreader = new FileReader();
            testreader.onload = (fileInput: any) => {


              this.urls[index]=fileInput.target.result;
                this.filesToUpload.push(imagefiles[0]);
            }
      
            testreader.readAsDataURL(fileInput.target.files[0]);
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
}
