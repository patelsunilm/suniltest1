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
  image : any;
  
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

    this.ProductService.getallproductbyId(params.id).subscribe(data => {

console.log('datas');
console.log(data);

      this.image = data.image
      this.form = this._formBuilder.group({
        id:[data._id],
        image: [ this.image],
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


updateproduct() {


  this.ProductService.updateproductgallery(this.filesToUpload).subscribe(data => {


    for (let i = 0; i < this.form.value.length; i++) {
    
      data.forEach(element => {
        this.form.value[i].image = element ;
      });
    
    }
console.log('dadasdasd')
console.log(this.form.value);
this.ProductService.updateprodcutdetail(this.form.value).subscribe(data => {
console.log('data');
console.log(data);

})

  })
}
}
