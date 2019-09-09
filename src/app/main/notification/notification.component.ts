import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../_services/index';
import { MerchantService } from '../../_services/index';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: fuseAnimations
})
export class NotificationComponent implements OnInit {
  form: FormGroup;
  constructor(private _formBuilder: FormBuilder, private UsersService : UsersService ,private MerchantService : MerchantService)  { }
  users : any;
  merchant : any;
  ngOnInit() {
    this.form = this._formBuilder.group({
    
      Message: [''],
      users : [''],
      merchant: ['']
    });

    this.UsersService.GetallUsersDetails()
    .subscribe(
      data => {
      
       this.users = data;
     
      },
      error => {
        console.log(error);
      });

      this.MerchantService.getallMerchentsData()
      .subscribe(
          data => {
   
            this.merchant = data.data;
          
          },
          error => {
              console.log(error);
          });

  }




  sendNotification() {

    console.log('testing');
    console.log(this.form.value);
  }
}
