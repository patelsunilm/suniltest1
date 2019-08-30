import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TillmanagementComponent } from './tillmanagement.component';
import {AddtillmanagementComponent} from './addtillmanagement/addtillmanagement.component'

import { AuthGuard } from './../../_guards/index';
import { from } from 'rxjs';


const routes = [
    {
        path: 'tillmanagement',
        component: TillmanagementComponent,
        //  canActivate: [AuthGuard]
    },
    {
        path: 'addtillmanagement',
        component: AddtillmanagementComponent,
        //  canActivate: [AuthGuard]
    },
];

@NgModule({
    declarations: [
        TillmanagementComponent,
        AddtillmanagementComponent
      
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
    ],
    exports: [
        TillmanagementComponent,
        AddtillmanagementComponent
    ]
})

export class  TillmanagementModule {
}
