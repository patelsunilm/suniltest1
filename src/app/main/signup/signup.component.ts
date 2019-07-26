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



@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SignupComponent implements OnInit {
  hide = true;
  ipAddress: any;
  registerForm: FormGroup;
  private _unsubscribeAll: Subject<any>;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  constructor(private _fuseConfigService: FuseConfigService, private http: HttpClient, public snackBar: MatSnackBar,
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

    // Set the private defaults
    this._unsubscribeAll = new Subject();


    this.http.get<{ ip: string }>('https://jsonip.com')
      .subscribe(data => {
        this.ipAddress = data.ip
      })


  }

  ngOnInit(): void {

    this.registerForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      BusinessName: ['', Validators.required],
      Secretquestion: ['', Validators.required],
      Secretanswer: ['', Validators.required],

    });
  }

  addsignupuser() {

    this.registerForm.value.ipAddress = this.ipAddress;
    this.registerForm.value.status = false;
    this.registerForm.value.uniqueid = Math.floor(100000000 + Math.random() * 900000000);
    this.registerForm.value.usertype = "Merchant";

    this.AuthenticationService.addsignupuser(this.registerForm.value).subscribe(
      data => {

        this.snackBar.open('SignUp successful.', '', {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.router.navigate(['login']);


      },
      error => {
        console.log(error);
      });
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }




}

