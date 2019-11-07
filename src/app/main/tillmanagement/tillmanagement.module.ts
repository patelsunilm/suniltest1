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
import { AuthGuardCo } from './../../_guards/index';

// import { AutoFocusDirective } from '../../auto-focus.directive';

const routes = [
    {
        path: 'tillmanagement',
        component: TillmanagementComponent,
        canActivate: [AuthGuardCo]
    },
    {
        path: 'addtillmanagement',
        component: AddtillmanagementComponent,
        canActivate: [AuthGuardCo]
        
    },
    {
        path: 'tillmanagement',
        component: deletetillmanagementpopupComponent,
        canActivate: [AuthGuardCo]
        
    },
    {
        path: 'updatetillmanagement/:id/:flag',
        component: UpdatetillmanagementComponent,
        canActivate: [AuthGuardCo]
        
    }
];

@NgModule({
    declarations: [
        TillmanagementComponent,
        AddtillmanagementComponent,
        deletetillmanagementpopupComponent,
        UpdatetillmanagementComponent,
        //  AutoFocusDirective
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
