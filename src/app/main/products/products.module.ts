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
import { UpdateproductComponent } from './updateproduct/updateproduct.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxLoadingModule } from 'ngx-loading';
import { MatSelectModule } from '@angular/material/select';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { AutofocusModule } from 'angular-autofocus-fix';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';
import { deleteproductpopupComponent} from './products.component';


//  import { AutoFocusDirective } from '../../auto-focus.directive';



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
        path: 'updateproduct/:id',
        component: UpdateproductComponent,
        canActivate: [AuthGuardCo]
    },
    {
        path: 'products',
        component: deleteproductpopupComponent,
        canActivate: [AuthGuardCo]
    }
];

@NgModule({
    declarations: [
        ProductsComponent,
        AddproductComponent,
        deleteproductpopupComponent,
        UpdateproductComponent,
       

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
        MatSelectModule,
        QRCodeModule,HttpClientModule,
        MatPaginatorModule, MatDatepickerModule, NgxBarcodeModule,NgxQRCodeModule,AutofocusModule
    ],
    exports: [
       
        deleteproductpopupComponent,
        AddproductComponent,
        ProductsComponent,
        UpdateproductComponent
    ]
})
export class ProductsModule {
}
