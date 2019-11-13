import { Component, OnInit } from '@angular/core';
import { OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../_services/index';

import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.scss'],
  animations: fuseAnimations

})
export class UpdateuserComponent implements OnInit {
  form: FormGroup;
  urls: Array<File> = [];
  filesToUpload: Array<File> = [];
  image: any;
  returnUrl: string;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private _formBuilder: FormBuilder, private UsersService: UsersService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar) { }

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


  ngOnInit() {

    this.form = this._formBuilder.group({
      image: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', { validators: [Validators.maxLength(10), Validators.required, Validators.minLength(10)] }],

    });


    this.route.params.subscribe(params => {

      this.UsersService.getuserbyId(params.id).subscribe(data => {

        this.image = data.image
        this.form = this._formBuilder.group({
          id: [data._id],
          image: [this.image],
          email: [data.email, [Validators.required, Validators.email]],
          firstname: [data.firstname],
          lastname: [data.lastname],
          phone: [data.phone],
        });
      })

    })

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';

  }

  fileChangeEvent(fileInput: any, index) {

    var imagefiles = fileInput.target.files;
    if (fileInput.target.files && fileInput.target.files[0]) {
      var filesAmount = fileInput.target.files.length;
      var regex = new RegExp("(.*?)\.(jpg|jpeg|png|raw|tiff)$");

      if (!(regex.test(fileInput.target.value.toLowerCase()))) {
        fileInput.target.value = ''
        this.snackBar.open('Please select correct file format', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
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

  delete(urls, event, index, i, _id) {
    this.route.params.subscribe(params => {
      //this.form.value._id = params.id;

      urls.splice(i, 1);

      //     this.CompanyService.deletearray(params.id, _id)
      //         .subscribe(
      //             data => {
      //             },
      //             error => {
      //             });
    })
  }


  updateuserdetail() {


    this.loading = true;
    if (this.filesToUpload.length > 0) {
      var data = this.filesToUpload.slice(-1);

      this.UsersService.updateuserprofile(data).subscribe(data => {
        this.form.value.image = data[0].s3url


        this.UsersService.updateuserdetails(this.form.value).subscribe(data => {


          if (data.string == "Email already exist.") {
            this.snackBar.open('Email already exist.', '', {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            })
            this.loading = false;
          } else {
            this.snackBar.open('User details updated successfully.', '', {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.loading = false;
            this.router.navigate([this.returnUrl]);

          }

        }, error => {
          console.log(error);

        })
      })


    } else {
      this.loading = true;
      this.UsersService.updateuserdetails(this.form.value).subscribe(data => {
        if (data.string == "Email already exist.") {
          this.snackBar.open('Email already exist.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          })
          this.loading = false;
        } else {
          this.snackBar.open('User details updated successfully.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        }
      }, error => {
        console.log(error);

      })


    }
  }
}
