import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { GraphComponent } from './graph.component';

 import { AuthGuardCommon } from './../../_guards/index';


const routes = [
  {
    path: 'graph',
    component: GraphComponent,
    canActivate: [AuthGuardCommon]
  },
];

@NgModule({
  declarations: [
    GraphComponent
  ],
  imports: [
     RouterModule.forChild(routes),

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,

    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,

    MatTabsModule,

    NgxChartsModule,

    FuseSharedModule,

    FuseWidgetModule,

    ChartsModule,
    NgxChartsModule,

    FuseSharedModule,
    FuseWidgetModule
  ],
  exports: [
    GraphComponent
  ]
})
export class GraphModule {
}

