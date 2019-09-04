import { Component, OnInit } from '@angular/core';
import {  OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { tillManagementService } from '../../../_services/index'


@Component({
  selector: 'app-updatetillmanagement',
  templateUrl: './updatetillmanagement.component.html',
  styleUrls: ['./updatetillmanagement.component.scss'],
  animations: fuseAnimations
})
export class UpdatetillmanagementComponent implements OnInit {
  form: FormGroup;
  constructor(private _formBuilder: FormBuilder ,  private route: ActivatedRoute, private tillManagementService :tillManagementService, public snackBar: MatSnackBar,
    private router: Router) { }
    secondaryid : any;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    returnUrl: string;
  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tillmanagement';
    this.form = this._formBuilder.group({
     
      name: ['', Validators.required],
     
  });


  this.route.params.subscribe(params => {
   
    var merchantId = localStorage.getItem('userId');
   
    this.tillManagementService.getTillnametbyId(params , merchantId).subscribe(data => {
      console.log('data');
      console.log(data);
       if(data.flag == 1) {

    
        this.form = this._formBuilder.group({
          name: [data.results.name, Validators.required],
      });
      } else if(data.flag == 2) {
        
        this.form = this._formBuilder.group({
          
          name: [data.results.secondary[0].name, Validators.required],
         
      });
      }  else if(data.flag == 3) { 

        this.form = this._formBuilder.group({
          
          name: [data.results[0].secondary.tertiary.name, Validators.required],
         
      });
      }
     
    })
  })
  }


  updatetilltype() {
   
    this.route.params.subscribe(params => {
    
       
      this.form.value.flag = params;
      this.form.value.merchantId = localStorage.getItem('userId');
    this.tillManagementService.updatetilltypename(this.form.value)
    .subscribe(
        data => {
         if(data.string == "Primary type is update successfully.") {
          this.snackBar.open('Primary type is update successfully.', '', {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            
        });
        this.router.navigate([this.returnUrl]);
         } else if(data.string == "Secondary type is update successfully." ) {

          this.snackBar.open('Secondary type is update successfully.', '', {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
        this.router.navigate([this.returnUrl]);
         }
        
        },
        error => {

            console.log(error);
        });
      })

      }

  }
