import { Component, OnInit } from '@angular/core';
import { OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, from } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';

import { FormControl, FormArray } from '@angular/forms';

import { ProductService } from '../../../_services/index';

import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer ,SafeHtml  } from '@angular/platform-browser';
import $ from "jquery";
import { template } from '@angular/core/src/render3';


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
  animations: fuseAnimations
})

export class AddproductComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  productForm: FormGroup;
  itemrow: any;
  checkboxdata = new Array();
  // urls = new Array(); 
  returnUrl: string;
  urls: Array<File> = [];
  filesToUpload: Array<File> = [];
  catName : any;
  test : any;
  htmlContent : any;
  htmlContent12 : any;
   private _inputpdf: string = '<mat-form-field appearance="outline"><mat-label>cat 11name</mat-label><input matInput formControlName="productcatname"></mat-form-field>';
  // private _inputpdf: string = '<input type="text">';

  
//   public get inputpdf()  {
//     return this._sanitizer.bypassSecurityTrustHtml(this._inputpdf);
//  }
  


  constructor(private _sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router
    , private _fb: FormBuilder, private ProductService: ProductService, public snackBar: MatSnackBar, ) {


  }
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate: TemplateRef<any>;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };

  // Private
  private _unsubscribeAll: Subject<any>;

  public toggleColours(): void {
    this.coloursEnabled = !this.coloursEnabled;

    if (this.coloursEnabled) {
      this.primaryColour = PrimaryRed;
      this.secondaryColour = SecondaryBlue;
    } else {
      this.primaryColour = PrimaryWhite;
      this.secondaryColour = SecondaryGrey;
    }
  }
  ngOnInit() {
    this.productForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows(

      )])
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';

    var merchantId = localStorage.getItem('userId');
    this.ProductService.getAllProductcategories(merchantId)
    .subscribe(
        data => {
               this.catName = data.data;

               console.log(this.catName)
          },
        error => {
            console.log(error);

        });


  }

  get formArr() {
    return this.productForm.get('itemRows') as FormArray;
  }

  initItemRows() {


    return this._fb.group({
      image: [''],
      productname: ['', Validators.required],
      productcategories : ['' ,Validators.required],
      productcatname : [''],
      costprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      Markup: ['', Validators.required],
      sellingprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      date: ['', Validators.required],
      tilltype: ['', Validators.required],
      stocklevel: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    });
  }

  addNewRow() {
    this.formArr.push(this.initItemRows());

     
  }

  deleteRow(indexs: number, urls) {


    this.formArr.removeAt(indexs);
    urls.splice(indexs, 1);
    var temp = new Array<File>();
    for (var j = 0; j < this.filesToUpload.length; j++) {
      if (j != indexs) {
        temp.push(this.filesToUpload[j]);
      }
    }

    this.filesToUpload = temp;
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


  addproduct() {
 
    this.loading = true;
    if (this.filesToUpload.length == 0 || this.filesToUpload.length !== this.productForm.value.itemRows.length) {
      this.loading = false;
      this.snackBar.open('Please select image.', '', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {

      this.ProductService.addproductgallery(this.filesToUpload).subscribe(data => {

        data.sort(function (obj1, obj2) {
          return obj1.index - obj2.index;

        });

        for (let i = 0; i < this.productForm.value.itemRows.length; i++) {
          var datetime = new Date(new Date).valueOf();
          var randomnumber = Math.floor((Math.random() * 100) + 1);

          this.productForm.value.itemRows[i].image = data[i].s3url;
          this.productForm.value.itemRows[i].barcode = datetime + randomnumber
          this.productForm.value.itemRows[i].merchantId = localStorage.getItem('userId');
      
        }

        

        this.ProductService.addproduct(this.productForm.value.itemRows).subscribe(data => {

          this.snackBar.open('Product added successfully.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.loading = false;

          this.router.navigate([this.returnUrl]);




          
        }, error => {
          console.log(error);

        })

      })

    }
  }


  addnewcategory(i) {

    $("#div_"+i).hide();
    
    $("#divshow_"+i).show();

    
     var Categoryhtml = '<mat-form-field appearance="outline"><mat-label  id="matcat'+i+'">category name</mat-label><input matInput formControlName="productcatname" id="cat'+i+'"></mat-form-field>'; 
      
    document.getElementById(i).innerHTML = Categoryhtml;
    //  document.getElementById(i).innerHTML = b;

  }


  addproductcategories(i) {
   

   var merchantId = localStorage.getItem('userId');


   var catname = ($("#cat"+i).val())



   
   this.ProductService.addproductcategories(catname ,merchantId)
   .subscribe(
       data => {

         if(data.string == "Product Category is already exist.") {
          this.snackBar.open('Product Category is already exist.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
         } else {
          this.snackBar.open('Product Category added successfully.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
      
              $("#divshow_"+i).hide();
              $("#cat"+ i).hide();
              $("#matcat"+ i).hide();
              $("#div_"+i).show();
            
              
            
              this.ProductService.getAllProductcategories(merchantId)
              .subscribe(
                  data => {
          
                    this.catName = data.data;
                   
                    // this.catName.forEach(element => {
                    //  if(element.catName  == catname){
                    //   console.log(element.productCatId) 
                    //  }
                    // });
                      
                  },
                  error => {
                      console.log(error);
          
                  });
            
             
               //  this.test = 'false';
              //  this.formArr.value[i].productcategories = "data._id";
  
         }
            
       },
       error => {
           console.log(error);

       });
  }
}
