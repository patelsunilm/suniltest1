import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { OrderComponent } from './order.component';

import { ProductorderdetailsComponent } from './productorderdetails/productorderdetails.component';

import { AuthGuardCo } from './../../_guards/index';


const routes = [
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuardCo]
  },
  {
    path: 'order/productorderdetails/:id',
    component: ProductorderdetailsComponent,
    canActivate: [AuthGuardCo]
  }
];

@NgModule({
  declarations: [
    OrderComponent,
    ProductorderdetailsComponent
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
    OrderComponent,
    ProductorderdetailsComponent
  ]
})

export class OrdersModule {
}
