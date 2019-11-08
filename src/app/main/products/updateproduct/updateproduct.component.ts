import { Component, OnInit } from '@angular/core';
import { OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer } from '@angular/platform-browser';
// import $ from "jquery";
import * as $ from 'jquery';
import { tillManagementService } from '../../../_services/index';
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
  Primary: any;
  Secondary: any;
  Tertiary: any;
  tilltypes: any;
  tillTypeId: any;
  catName: any;
  disableTextbox =  false;
  f = true;
  constructor(private ProductService: ProductService, private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer, private tillManagementService: tillManagementService) { }

  ngOnInit() {
    this.f = true
   
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

    this.form.controls['movestockinputvalue'].disable();
    this.route.params.subscribe(params => {

      var merchantId = localStorage.getItem('userId');

      this.ProductService.getallproductbyId(params.id ,merchantId).subscribe(data => {        
        this.tilltypes = data.tilltype;
        //  this.tilltypes = "Tertiary";
        this.tillTypeId = data.tillTypeId;
        this.image = data.image;
      
        this.form = this._formBuilder.group({
          id: [data._id],
          image: [this.image],
          productname: [data.productname],
          costprice: [data.costprice, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
          markup: [data.markup, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
          sellingprice: [data.sellingprice, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
          date: [data.date],
          tilltype: [data.tilltype ],
          tilltypename: [data.tillTypeName, Validators.required],
          stocklevel: [data.stocklevel, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
          movestock: [''],

          movestockinputvalue: new FormControl({ value: "", disabled: true }, [
            Validators.required
          ]),
          // movestockinputvalue: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
          catname: [data.productcatid]
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

            if (this.tilltypes == 'Tertiary') {

              var Secondarydetails = data[0].secondary;
              
              var tertiarydetails = []
              Secondarydetails.forEach(element => {

                element.tertiary.forEach(product => {
                  if (this.tillTypeId == product._id) {
                 
                    tertiarydetails.push(element)
                  }
                });
              });

              this.Secondary = tertiarydetails

              if (tertiarydetails[0]) {
              
               var tertiarydata = tertiarydetails[0].tertiary;
               var a = [];
               tertiarydata.forEach(element => {
                 if(element._id !== this.tillTypeId) {

                  a.push(element);
                 }
               });

                this.Tertiary =a;
              }

            } else {
            

              this.Primary = data;
              var  Secondarydata = data[0].secondary;
              var secondary = []
              Secondarydata.forEach(element => {
              if(element._id !== this.tillTypeId){
             
                secondary.push(element);
               } 
               });
               
             this.Secondary = secondary;
             
              var tertiarytype = []
              Secondarydata.forEach(element => {
                if (element._id == this.tillTypeId) {
                        
                  tertiarytype.push(element.tertiary)
                } else {
                
                }
              });
          
              this.Tertiary = tertiarytype[0];

            }
          }
        },
        error => {
          // console.log("error");
        });

    var merchantId = localStorage.getItem('userId');
    this.ProductService.getAllProductcategories(merchantId)
      .subscribe(
        data => {
          this.catName = data.data;
        },
        error => {
          console.log(error);

        });

        this.form.get('movestockinputvalue').disable();
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

      } else {

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

  
    var movestock = parseInt( (this.form.value.movestockinputvalue == ''  || this.form.value.movestockinputvalue == 'undefined' || this.form.value.movestockinputvalue == undefined) ? 0 : this.form.value.movestockinputvalue);
   
    if (parseInt(this.form.value.stocklevel) >= movestock) {

      if (this.filesToUpload.length > 0) {

        var data = this.filesToUpload.slice(-1);
        this.ProductService.updateproductgallery(data).subscribe(data => {

          this.form.value.image = data[0].s3url
         
          this.form.value.sellingprice = ($("#selling").val());
          var stocklevelvalue = this.form.value.movestockinputvalue == undefined ? 0 :  this.form.value.movestockinputvalue;
          var stock = (this.form.value.stocklevel - stocklevelvalue);
          var movestockdetails = (this.form.value.movestock == undefined ? '' : this.form.value.movestock)
          var valuesplit = movestockdetails.split(',');
          this.form.value.form = this.form.value.tilltype;
          this.form.value.to = (valuesplit[1] == undefined ? '' : valuesplit[1]);
        
          var tillTypeId;
          if(valuesplit[0] == '' || valuesplit[0] == undefined) {
             
             tillTypeId = this.tillTypeId;
          }  else {
         
            tillTypeId = valuesplit[0];
          }         
          this.form.value.tillTypeId = tillTypeId;
          
          this.form.value.tilltypename = valuesplit[2] == undefined ? this.form.value.tilltypename :valuesplit[2];
          this.form.value.fromstock = this.form.value.stocklevel;
          this.form.value.movestock = this.form.value.movestockinputvalue == undefined ? '' :  this.form.value.movestockinputvalue;
          this.form.value.tilltype = (valuesplit[1] == undefined ? this.form.value.tilltype : valuesplit[1]);
          this.form.value.stocklevel = stock;
          this.form.value.toId = this.tillTypeId;
          this.form.value.fromId = tillTypeId;
   
          this.ProductService.updateprodcutdetail(this.form.value).subscribe(data => {
            this.snackBar.open('Product update success fully', '', {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.router.navigate([this.returnUrl]);

          }, error => {
            // console.log(error);

          })

        })
      } else {


        this.form.value.sellingprice = ($("#selling").val());
        var stocklevelvalue = this.form.value.movestockinputvalue == undefined ? 0 :  this.form.value.movestockinputvalue;
        var stock = (this.form.value.stocklevel - stocklevelvalue);
        var movestockdetails = (this.form.value.movestock == undefined ? '' : this.form.value.movestock)
        var valuesplit = movestockdetails.split(',');
        this.form.value.form = this.form.value.tilltype;
        this.form.value.to = (valuesplit[1] == undefined ? '' : valuesplit[1]);
      
        var tillTypeId;
        if(valuesplit[0] == '' || valuesplit[0] == undefined) {
           
           tillTypeId = this.tillTypeId;
        }  else {
       
          tillTypeId = valuesplit[0];
        }         
        this.form.value.tillTypeId = tillTypeId;
        
        this.form.value.tilltypename = valuesplit[2] == undefined ? this.form.value.tilltypename :valuesplit[2];
        this.form.value.fromstock = this.form.value.stocklevel;
        this.form.value.movestock = this.form.value.movestockinputvalue == undefined ? '' :  this.form.value.movestockinputvalue;
        this.form.value.tilltype = (valuesplit[1] == undefined ? this.form.value.tilltype : valuesplit[1]);
        this.form.value.stocklevel = stock;
        this.form.value.toId = this.tillTypeId;
        this.form.value.fromId = tillTypeId;
 
      
        this.ProductService.updateprodcutdetail(this.form.value).subscribe(data => {

          this.snackBar.open('Product update success fully', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          this.router.navigate([this.returnUrl]);
        }, error => {
          // console.log(error);

        })
      }

    } else {

      this.snackBar.open('Move stock should be smaller then Stock level', '', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

  }


  netamount(i) {

    var costprice = ($("#costprice").val()) ? parseFloat($("#costprice").val()) : 0;
    var markupprice = ($("#markup").val()) ? parseFloat($("#markup").val()) : 0;

    var sellingprice = (costprice + markupprice)
    $("#selling").val(sellingprice)

  }

  onSelectionChanged({ value }) {
      
    if (value === 'undefined' ||value === undefined) {
      this.form.get('movestockinputvalue').disable();
    } else {
     this.form.get('movestockinputvalue').enable();
    }
  }
  

  
}
