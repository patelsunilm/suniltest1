import { Component, OnInit } from '@angular/core';
import {  OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, from } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';

import {FormControl, FormArray} from '@angular/forms';

import {ProductService} from '../../../_services/index';
import { element } from '@angular/core/src/render3';
import { Observable }    from 'rxjs/Observable';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
  animations: fuseAnimations
})

export class AddproductComponent implements OnInit {
 
  productForm: FormGroup;
  itemrow :any;
  checkboxdata = new Array();
  // urls = new Array(); 

   urls: Array<File> =[];
  filesToUpload: Array<File> = [];
 
  constructor(private _fb: FormBuilder ,private ProductService : ProductService) {

     
   }

   ngOnInit() {
    this.productForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()])
    });
  }

  get formArr() {
    return this.productForm.get('itemRows') as FormArray;
  }

  initItemRows() {


    return this._fb.group({
      image: [''],
      productname : ['',Validators.required],
      costprice : ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      Markup : ['',Validators.required],
      sellingprice : ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      date : ['',Validators.required],
      tilltype : ['',Validators.required],
      stocklevel : ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    });
  }

  addNewRow() {
    
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
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


addproduct() {

  console.log('test products');
  console.log(this.productForm.value.itemRows);

console.log('this file upload');
console.log(this.filesToUpload);
if(this.filesToUpload) {
console.log('test');
} else {

}


return false
this.ProductService.addproductgallery(this.filesToUpload).subscribe(data => {

for (let index = 0; index < this.productForm.value.itemRows.length; index++) {
    
  data.forEach(element => {
    this.productForm.value.itemRows[index].image = element ;
  });

}
this.ProductService.addproduct(this.productForm.value.itemRows).subscribe(data => {


})
})
}
}
