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
import { AuthGuardCo } from '../../_guards/index';
import { AuthGuard } from './../../_guards/index';
import { MatTableModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material';
import{AddproductComponent} from '../products/addproduct/addproduct.component' 
import {MatDatepickerModule} from '@angular/material/datepicker';
// import { } from '../products/' 

import { deleteproductPopupComponent } from './products.component';
import { UpdateproductComponent } from './updateproduct/updateproduct.component';

import { NgxBarcodeModule } from 'ngx-barcode';


const routes = [
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'addproduct',
        component: AddproductComponent
    },
    {
        path: 'products',
        component: deleteproductPopupComponent
    },

    {
        path: 'updateproduct/:id',
        component: UpdateproductComponent
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
        MatPaginatorModule,MatDatepickerModule,NgxBarcodeModule
    ]
})
export class ProductsModule {
}
