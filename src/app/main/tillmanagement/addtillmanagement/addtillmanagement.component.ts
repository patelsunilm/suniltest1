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
import { tillManagementService } from '../../../_services/index';
import * as $ from 'jquery';

@Component({
  selector: 'app-addtillmanagement',
  templateUrl: './addtillmanagement.component.html',
  styleUrls: ['./addtillmanagement.component.scss'],
  animations: fuseAnimations
})
export class AddtillmanagementComponent implements OnInit {
  form: FormGroup;
  tilltype: any;
  showSecondary: any;
  tilltypevalue: any;
  secondarydetails: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  requiretiming: boolean = false;
  currentclass: string = 'hidefield';
  constructor(private _formBuilder: FormBuilder, private tillManagementService: tillManagementService, public snackBar: MatSnackBar, ) { }

  ngOnInit() {

    // Reactive Form
    this.form = this._formBuilder.group({

      tillTypeId: ['', Validators.required],
       Secondaryid: [''],
      tillName: ['', Validators.required],

    });


    this.tillManagementService.getalltillType()
      .subscribe(
        data => {

          this.tilltype = data

        },
        error => {
          // console.log(error);

        });

    var merchantId = localStorage.getItem('userId');

    
    this.tillManagementService.getAllsecondarytilltype(merchantId)
      .subscribe(
        data => {
        
          if(data == null || data == "null") {

          } else {
            this.secondarydetails = data.secondary;
          }
        
        },
        error => {
          console.log(error);

        });



  }

  addTillManagement() {

  
    this.form.value.merchantId = localStorage.getItem('userId');
    this.form.value.tilltype = this.tilltypevalue
    

   
    this.tillManagementService.addtilldetails(this.form.value).subscribe(data => {

      if (data.string == "Primary type is add successfully.") {
        this.snackBar.open('Primary type is add successfully.', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      } else if (data.string == "Primary type is already exist.") {
        this.snackBar.open('Primary type is already exist.', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      } else if (data.string == "Pls Primary type select.") {
        this.snackBar.open('Pls primary type select.', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else if (data.string == "Secondary type is add successfully.") {

        this.snackBar.open('Secondary type is add successfully.', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        var merchantId = localStorage.getItem('userId');
        this.tillManagementService.getAllsecondarytilltype(merchantId)
          .subscribe(
            data => {

              this.secondarydetails = data.secondary

            },
            error => {
              console.log(error);

            });

      } else if (data.string == "tertiary name is add successfully.") {
        this.snackBar.open('tertiary name is add successfully.', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else if(data.string == "Name is already exist.") {
        this.snackBar.open('Name is already exist.', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }, error => {

    })

  }



  openSecondary(valuess) {

   
  
      this.tilltypevalue = valuess
    if (this.tilltypevalue == "Tertiary") {

      this.showSecondary = true;
      this.currentclass = 'showfield';
      console.log('thisss 12333');
      
      // this.form.valueChanges.subscribe(value => {
       this.form.get("Secondaryid").setValidators([Validators.required]); 
      
      // })
      } else {


       this.showSecondary = false
       this.currentclass = 'hidefield';
     
      
       this.form.controls["Secondaryid"].clearValidators(); 
     
      
    }
  }
  onChange() {

    console.log('te');
  }
}
