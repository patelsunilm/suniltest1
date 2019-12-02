import { Component, ViewEncapsulation ,OnInit} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-chat-start',
  templateUrl: './chat-start.component.html',
  styleUrls: ['./chat-start.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChatStartComponent implements OnInit {

  constructor(  private socket: Socket) { }

  ngOnInit() {
  }


 
}
