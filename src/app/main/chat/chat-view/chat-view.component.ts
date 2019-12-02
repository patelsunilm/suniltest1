import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ChatService } from 'app/_services/index';
import { Socket } from 'ngx-socket-io';
import { copyStyles } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatViewComponent implements OnInit {

  user: any;
  chat: any;
  dialog: any;
  contact: any; 
  replyInput: any;
  selectedChat: any;

  @ViewChild(FusePerfectScrollbarDirective)
  directiveScroll: FusePerfectScrollbarDirective;

  @ViewChildren('replyInput')
  replyInputField;

  @ViewChild('replyForm')
  replyForm: NgForm;
  documents :any;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   */
  constructor(
      private _chatService: ChatService,private socket: Socket
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

      this._chatService.onChatSelected
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(chatData => {
              if ( chatData )
              {
                
                   this.user = chatData.contact;
                   this.selectedChat = chatData;
                    this.contact = chatData.contact;
                    this.dialog = chatData.dialog;
                  this.readyToReply();
              }
          });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void
  {
      this.replyInput = this.replyInputField.first.nativeElement;
      this.readyToReply();
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
   * Decide whether to show or not the contact's avatar in the message row
   *
   * @param message
   * @param i
   * @returns {boolean}
   */
  shouldShowContactAvatar(message, i): boolean
  {
      return (
          message.who === this.contact.id &&
          ((this.dialog[i + 1] && this.dialog[i + 1].who !== this.contact.id) || !this.dialog[i + 1])
      )
  }

  /**
   * Check if the given message is the first message of a group
   *
   * @param message
   * @param i
   * @returns {boolean}
   */
  isFirstMessageOfGroup(message, i): boolean
  {
   

      return (i === 0 || this.dialog[i - 1] && this.dialog[i - 1].who !== message.who);
  }

  /**
   * Check if the given message is the last message of a group
   *
   * @param message
   * @param i
   * @returns {boolean}
   */
  isLastMessageOfGroup(message, i): boolean
  {
    

      return (i === this.dialog.length - 1 || this.dialog[i + 1] && this.dialog[i + 1].who !== message.who);
  }

  /**
   * Select contact
   */
  selectContact(): void
  {
    
      this._chatService.selectContact(this.contact);

  }

  /**
   * Ready to reply
   */
  readyToReply(): void
  {
      setTimeout(() => {
          this.focusReplyInput();
          this.scrollToBottom();
      });
  }

  /**
   * Focus to the reply input
   */
  focusReplyInput(): void
  {
      setTimeout(() => {
          this.replyInput.focus();
      });
  }

  /**
   * Scroll to the bottom
   *
   * @param {number} speed
   */
  scrollToBottom(speed?: number): void
  {
      speed = speed || 400;
      if ( this.directiveScroll )
      {
          this.directiveScroll.update();

          setTimeout(() => {
              this.directiveScroll.scrollToBottom(0, speed);
          });
      }
  }

  /**
   * Reply
   */
  reply(event): void
  {

    
    // console.log('send message');
    // console.log(this.replyForm.form);
    var userId = localStorage.getItem('userId');

      event.preventDefault();

      if ( !this.replyForm.form.value.message )
      {
          return;
      }

      const message = {
           toid: userId,
           formid : this.selectedChat.chatId._id,
           message: this.replyForm.form.value.message,
           time   : new Date().toISOString()
      
        };


      this.socket.emit('addMessage', { "message"  :message });
     
      this.replyForm.reset();

      // Update the server
    //   this._chatService.updateDialog(this.selectedChat.chatId, this.dialog).then(response => {
    //       this.readyToReply();
    //   });
  }

}
