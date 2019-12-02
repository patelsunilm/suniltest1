import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ChatService } from 'app/_services/index';
import { fuseAnimations } from '@fuse/animations';
import { MerchantService } from '../../../../../_services/index';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UserComponent implements OnInit {

  user: any;
  userForm: FormGroup;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   */
  constructor(
      private _chatService: ChatService,private MerchantService: MerchantService
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {

    
    this.MerchantService.getchatallMerchentsData()
    .subscribe(
        data => {
        
            var contact = data
            var merchant = []
            var users = []
           contact.forEach(element => {
            var userId = localStorage.getItem('userId');
               
              if(element._id == userId ){
                element.avatar = element.image
                element.id =    element.merchantId
                element.mood = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                element.name = element.name
                element.status =  "online"
                users.push(element);
              } else {
                element.avatar = element.image
                element.id =    element.merchantId
                element.mood = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                element.name = element.name
                element.status =  "online"
                merchant.push(element)
              }

           });
           
          //  this.user = users
          //  this.contacts = merchant;
           //this.chats = this._chatService.chats;
           this.user =users
        },
        error => {
            console.log(error);
        });

       
      this.userForm = new FormGroup({
          mood  : new FormControl(this.user[0].mood),
          status: new FormControl(this.user[0].status)
      });

    //   this.userForm.valueChanges
    //       .pipe(
    //           takeUntil(this._unsubscribeAll),
    //           debounceTime(500),
    //           distinctUntilChanged()
    //       )
    //       .subscribe(data => {
    //           this.user.mood = data.mood;
    //           this.user.status = data.status;
    //           this._chatService.updateUserData(this.user);
    //       });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Change left sidenav view
   *
   * @param view
   */
  changeLeftSidenavView(view): void
  {
      this._chatService.onLeftSidenavViewChanged.next(view);
  }


}
