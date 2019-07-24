import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule,MatDialogModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import {  ProductsComponent } from 'app/main/products/products.component';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FuseHighlightModule } from '@fuse/components/index';

import { MatTableModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material';
import{AddproductComponent} from '../products/addproduct/addproduct.component' 
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AuthGuardCo } from './../../_guards/index';

import { deleteproductPopupComponent } from './products.component';
import { UpdateproductComponent } from './updateproduct/updateproduct.component';

import { NgxBarcodeModule } from 'ngx-barcode';
 import { NgxLoadingModule } from 'ngx-loading';


const routes = [
    {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuardCo]
    },
    {
        path: 'addproduct',
        component: AddproductComponent,
        canActivate: [AuthGuardCo]
    },
    {
        path: 'products',
        component: deleteproductPopupComponent,
        canActivate: [AuthGuardCo]
    },

    {
        path: 'updateproduct/:id',
        component: UpdateproductComponent,
        canActivate: [AuthGuardCo]
    }
];

@NgModule({
    declarations: [
        ProductsComponent,
        AddproductComponent,
        deleteproductPopupComponent,
        UpdateproductComponent
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
        NgxLoadingModule,
        MatPaginatorModule,MatDatepickerModule,NgxBarcodeModule
    ]
})
export class ProductsModule {
}
