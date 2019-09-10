import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../_services/index';
import { NotificationService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { MerchantService } from '../../_services/index';
import { FormControl } from '@angular/forms';

import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: fuseAnimations
})
export class NotificationComponent implements OnInit {
  form: FormGroup;
  constructor(public snackBar: MatSnackBar,private NotificationService: NotificationService, private _formBuilder: FormBuilder, private UsersService: UsersService, private MerchantService: MerchantService) { }
  users: any;
  merchant: any;
  private _onDestroy = new Subject<void>();
  public bankMultiFilterCtrl: FormControl = new FormControl();

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnInit() {
    this.form = this._formBuilder.group({

      Message: [''],
      users: [''],

    });

    this.UsersService.GetallUsersDetails()
      .subscribe(
        data => {

          var user = data
          const allusers = [];
          user.forEach(element => {

            if (element.deviceToken == '') {

            } else {
              allusers.push(element);
            }
          });

          this.users = allusers

        },
        error => {
          console.log(error);
        });


    // this.bankMultiFilterCtrl.valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.users()
    // });

  }


  // private filterBanksMulti() {
  //   if (!this.users) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.bankMultiFilterCtrl.value;
  //   if (!search) {
  //     this.users.next(this.users.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the banks
  //   this.users.next(
  //     this.users.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
  //   );
  // }



  sendNotification() {

    console.log('testing');
    console.log(this.form.value);

    this.NotificationService.addnotification(this.form.value)
      .subscribe(
        data => {
          this.snackBar.open('Notification send successfully.', '', {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
        },
        error => {

          console.log(error);
        });
  }



}