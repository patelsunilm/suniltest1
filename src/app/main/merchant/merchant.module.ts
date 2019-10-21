import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MerchantComponent } from './merchant.component';
import { UpdateMerchantComponent } from './updatemerchant/updatemerchant.component';
import { deletemerchantpopupComponent } from './merchant.component';

import { AuthGuard } from './../../_guards/index';

import { AutofocusModule } from 'angular-autofocus-fix';

const routes = [
    {
        path: 'merchant',
        component: MerchantComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'merchant/updatemerchant/:id',
        component: UpdateMerchantComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'merchant',
        component: deletemerchantpopupComponent,
        canActivate: [AuthGuard]
    }

];

@NgModule({
    declarations: [
        MerchantComponent,
        UpdateMerchantComponent,
        deletemerchantpopupComponent
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
        AutofocusModule
    ],
    exports: [
        MerchantComponent,
        UpdateMerchantComponent,
        deletemerchantpopupComponent
    ]
})

export class MerchantModule {
}
