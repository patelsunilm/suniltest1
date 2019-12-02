import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { MerchantService } from '../../_services/index';

import { ChatService } from 'app/_services/index';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChatComponent implements OnInit {

  selectedChat: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   */
  constructor(
      private _chatService: ChatService, private MerchantService: MerchantService
  )
  {
      
      this._unsubscribeAll = new Subject();
  }

  
  ngOnInit(): void
  {
      this._chatService.onChatSelected
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(chatData => {
            
              this.selectedChat = chatData;
          });
  }
 
  
  
  ngOnDestroy(): void
  {
    
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}
