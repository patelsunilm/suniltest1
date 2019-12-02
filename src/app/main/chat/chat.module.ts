import { NgModule } from '@angular/core';
import { MatCardModule,MatInputModule,MatRadioModule, MatSidenavModule, MatToolbarModule
    ,MatButtonModule, MatListModule,MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';


import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { AuthGuardCo } from './../../_guards/index';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ChatStartComponent } from './chat-start/chat-start.component';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { ChatsComponent } from './sidenavs/left/chats/chats.component';
import { UserComponent } from './sidenavs/left/user/user.component';
import { ContactComponent } from './sidenavs/right/contact/contact.component';
import {LeftComponent} from 'app/main/chat/sidenavs/left/left.component'
import {RightComponent} from 'app/main/chat/sidenavs/right/right.component'
import { ChatComponent } from './chat.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
 
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const routes = [
    {
        path: 'chat',
        component: ChatComponent,
         canActivate: [AuthGuardCo]
    },

];


@NgModule({
    declarations: [
         ChatComponent,
         ChatStartComponent,
         ChatViewComponent,
         ChatsComponent,
         UserComponent,
         ContactComponent,
         LeftComponent,
         RightComponent
       
    ],
    imports: [
         RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatInputModule,
        NgxChartsModule,
        MatPaginatorModule,
        MatDialogModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatFormFieldModule,SocketIoModule.forRoot(config),MatCardModule,MatInputModule,MatRadioModule, MatSidenavModule, MatToolbarModule
,
        NgxMatSelectSearchModule,MatCardModule,MatListModule,MatRadioModule, MatSidenavModule, MatToolbarModule
    ],
    exports: [
        ChatComponent,
        ChatStartComponent,
         ChatViewComponent,
         ChatsComponent,
         UserComponent,
         ContactComponent,LeftComponent,RightComponent
    ]
})

export class ChatModule {
}
