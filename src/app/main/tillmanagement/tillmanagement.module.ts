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
import { deletetillmanagementpopupComponent } from './tillmanagement.component'
import {AddtillmanagementComponent} from './addtillmanagement/addtillmanagement.component'

import { AuthGuard } from './../../_guards/index';
import { from } from 'rxjs';
import { UpdatetillmanagementComponent } from './updatetillmanagement/updatetillmanagement.component';


const routes = [
    {
        path: 'tillmanagement',
        component: TillmanagementComponent,
       
    },
    {
        path: 'addtillmanagement',
        component: AddtillmanagementComponent,
        
    },
    {
        path: 'tillmanagement',
        component: deletetillmanagementpopupComponent,
        
    },
    {
        path: 'updatetillmanagement/:id/:flag',
        component: UpdatetillmanagementComponent,
        
    }
];

@NgModule({
    declarations: [
        TillmanagementComponent,
        AddtillmanagementComponent,
        deletetillmanagementpopupComponent,
        UpdatetillmanagementComponent
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
        AddtillmanagementComponent,
        deletetillmanagementpopupComponent,
        UpdatetillmanagementComponent
    ]
})

export class  TillmanagementModule {
}
