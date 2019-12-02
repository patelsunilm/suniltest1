import { Component, OnDestroy, ViewChild, OnInit,TemplateRef, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../_services/index';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


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
  merchantcategories : any;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate: TemplateRef<any>;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };
 

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
      phone: ['', { validators: [Validators.maxLength(12), Validators.required, Validators.minLength(9)] }],
      BusinessName: ['', Validators.required],
      Secretquestion: ['', Validators.required],
      Secretanswer: ['', Validators.required],
      // merchantcatname : ['', Validators.required]

    });

  
    this.AuthenticationService.getmerchantcategories()
    .subscribe(data => {
      
      this.merchantcategories = data;
     
     

    })
  }

  addsignupuser() {


    this.loading = true;
    this.registerForm.value.ipAddress = this.ipAddress == undefined ? '' :this.ipAddress;
    this.registerForm.value.status = true;
    this.registerForm.value.uniqueid = Math.floor(100000000 + Math.random() * 900000000);
    this.registerForm.value.usertype = "Merchant";
     
    this.registerForm.value.cityid = '';
    this.registerForm.value.stateid = '';
    this.registerForm.value.countriid = '';
    this.registerForm.value.categoryid = '';
    this.registerForm.value.fontcolor = '';
    this.registerForm.value.backgroundtheme = '';
    this.registerForm.value.image = '';
    
  
    
    this.AuthenticationService.addsignupuser(this.registerForm.value).subscribe(
      data => {
          
     
        
        if(data.string == "Email already exist.") {
          this.snackBar.open('email already exists', '', {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.loading = false;

        } else if(data.string == "You have signed up successfully."){
          this.snackBar.open('You have signed up successfully.', '', {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.loading = false;

          this.router.navigate(['login']);
        } else if(data.string == "Business name is already exist."){
          this.snackBar.open('Business name is already exists.', '', {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.loading = false;

        }
      
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

