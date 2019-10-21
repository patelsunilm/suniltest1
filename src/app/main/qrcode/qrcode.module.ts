import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { QrcodeComponent } from 'app/main/qrcode/qrcode.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { MatSelectModule } from '@angular/material/select';

import { AutofocusModule } from 'angular-autofocus-fix';
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes = [
    {
        path: 'product/:id',
        component: QrcodeComponent
    },
   
];

@NgModule({
    declarations: [
        QrcodeComponent,
        
    ],
    imports: [
        RouterModule.forChild(routes),
        AutofocusModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        FuseSharedModule,
        MatDialogModule, HttpClientModule, BrowserModule,
        MatSelectModule,
        MatDatepickerModule
    ],
   
    bootstrap: []
})
export class QrcodeModule {
}
