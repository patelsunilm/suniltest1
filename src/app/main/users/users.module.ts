import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDialogModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { ProductsComponent } from 'app/main/products/products.component';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseHighlightModule } from '@fuse/components/index';

import { MatTableModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material';
import { AddproductComponent } from '../products/addproduct/addproduct.component'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthGuardCo } from './../../_guards/index';
import { UsersComponent } from './users.component';
import { deleteproductPopupComponent } from './users.component';
import { UpdateuserComponent } from './updateuser/updateuser.component';
import { NgxLoadingModule } from 'ngx-loading';


const routes = [
    {
        path: 'users',
        component: UsersComponent,

    },
    {
        path: 'users',
        component: deleteproductPopupComponent,

    },
    {
        path: 'updateuser/:id',
        component: UpdateuserComponent,
        // canActivate: [AuthGuardCo]
    }
];

@NgModule({
    declarations: [
        UsersComponent,
        deleteproductPopupComponent,
        UpdateuserComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        FuseSharedModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        FuseHighlightModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatDialogModule,
        MatPaginatorModule, MatDatepickerModule, NgxLoadingModule
    ]
})
export class UsersModule {
}
