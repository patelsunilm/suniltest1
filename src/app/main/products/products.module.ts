import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';
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






const routes = [
    {
        path: 'products',
        component: ProductsComponent
    }
];

@NgModule({
    declarations: [
        ProductsComponent
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
        MatPaginatorModule
    ]
})
export class ProductsModule {
}
