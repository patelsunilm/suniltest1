import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { ChatService } from 'app/_services/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ObservableMedia } from '@angular/flex-layout';
import { FuseMatSidenavHelperService } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.service';
import { fuseAnimations } from '@fuse/animations';
import { MerchantService } from '../../../../../_services/index';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChatsComponent implements OnInit {
  chats: any[];
  chatSearch: any;
  contacts: any[];
  searchText: string;
  user: any;
  onChatSelected: BehaviorSubject<any>;
  onContactSelected: BehaviorSubject<any>;
  meals: any[] = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {FuseMatSidenavHelperService} _fuseMatSidenavHelperService
   * @param {ObservableMedia} _observableMedia
   */
  constructor(  private _chatService: ChatService,
    private _fuseMatSidenavHelperService: FuseMatSidenavHelperService,
    public _observableMedia: ObservableMedia,private MerchantService: MerchantService,
    private socket: Socket
    ) { 

 // Set the defaults
 this.chatSearch = {
  name: ''
};
this.searchText = '';

// Set the private defaults
this._unsubscribeAll = new Subject();


    }

  ngOnInit() {
    
    console.log('hello a');
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

                var newtwst = {}
               
                element.avatar = element.image
                element.id =    element.merchantId
                element.mood = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                element.name = element.name
                element.status =  "online"
                merchant.push(element)
              }

           });
           
           this.user = users;
           
           console.log(merchant);
           this.contacts = merchant;
          
          //  this.user = this._chatService.user;
          
          //  this.contacts = this._chatService.contacts;
        },
        error => {
            
        });

  
  }


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
     * Get chat
     *
     * @param contact
     */
    getChat(contact): void
    {

      
      
      this.MerchantService.getchatallMerchentsData()
      .subscribe(
          data => {
          
              var contacts = data
              var merchant = []
              var users = []
              contacts.forEach(element => {
                if(element._id == contact ){
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

        var userId = localStorage.getItem('userId');
        var getallmessga = {
             toid: userId,
             formid: users[0]._id
           }

           
        this.socket.emit('getMessageByid', { "message"  :getallmessga });    
      
        this.socket.on('getchatMessage', getchatMessage => {

         
          if(getchatMessage.message == '' || getchatMessage.message == undefined || getchatMessage.message == "undefined") {
            const chatData = {
              chatId : users[0],
              dialog : newmessge,
              contact: users[0]
             };
              this._chatService.getChat(chatData);
          } else {
            var newmessge = []
            getchatMessage.message.forEach(element => {
              
                const getmessage = {
                    who    : element.formId,
                    message: element.message,
                    time   : element.time
               
                 };
                  newmessge.push(getmessage);
            });

            const chatData = {
              chatId : users[0],
              dialog : newmessge,
              contact: users[0]
             };
              this._chatService.getChat(chatData);
          }

         
        })

          },
          error => {
              console.log(error);
          });

        

        if ( !this._observableMedia.isActive('gt-md') )
        {
             this._fuseMatSidenavHelperService.getSidenav('app-left').toggle();
        }
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void
    {
//         this.user = this._chatService.user;
        //  this.chats = this._chatService.chats;
        //  this.contacts = this._chatService.contacts;
        // this._chatService.setUserStatus(status);
    }

    /**
     * Change left sidenav view
     *
     * @param view
     */
    changeLeftSidenavView(view): void
    {

     
      this._chatService.onLeftSidenavViewChanged.next(view);
      
    }

    /**
     * Logout
     */
    logout(): void
    {
        console.log('logout triggered');
    }

   
}
