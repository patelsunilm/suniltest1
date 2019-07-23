import { Component, OnInit } from '@angular/core';
import { OnDestroy, ViewChild, TemplateRef } from '@angular/core';
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

import { ProductService } from '../../../_services/index';

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

  urls: Array<File> = [];
  filesToUpload: Array<File> = [];
  image: any;
  returnUrl: string;

  constructor(private ProductService: ProductService, private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {

    this.form = this._formBuilder.group({
      image: [''],
      productname: ['', Validators.required],
      costprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      markup: ['', Validators.required],
      sellingprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      date: ['', Validators.required],
      tilltype: ['', Validators.required],
      stocklevel: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    });

    this.route.params.subscribe(params => {

      this.ProductService.getallproductbyId(params.id).subscribe(data => {
        this.image = data.image
        this.form = this._formBuilder.group({
          id: [data._id],
          image: [this.image],
          productname: [data.productname],
          costprice: [data.costprice],
          markup: [data.markup],
          sellingprice: [data.sellingprice],
          date: [data.date],
          tilltype: [data.tilltype],
          stocklevel: [data.stocklevel]
        });
      })

    })


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';

  }

  fileChangeEvent(fileInput: any, index) {

    var imagefiles = fileInput.target.files;
    if (fileInput.target.files && fileInput.target.files[0]) {
      var filesAmount = fileInput.target.files.length;

      var testreader = new FileReader();
      testreader.onload = (fileInput: any) => {


        this.urls[index] = fileInput.target.result;
        this.filesToUpload.push(imagefiles[0]);
      }

      testreader.readAsDataURL(fileInput.target.files[0]);
    }
  }


  close(urls, event, index, i) {

    console.log('test123');

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


    if (this.filesToUpload.length > 0) {


      var data = this.filesToUpload.slice(-1);
      this.ProductService.updateproductgallery(data).subscribe(data => {


        this.form.value.image = data.toString()

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
}