import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { Login2Component } from 'app/main/login/login.component';
import { secretvaluepopupComponent } from './login.component';

const routes = [
    {
        path: 'login',
        component: Login2Component
    },
    {
        path: 'login',
        component: secretvaluepopupComponent,
    }
];

@NgModule({
    declarations: [
        Login2Component,
        secretvaluepopupComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        FuseSharedModule
    ]
})
export class Login2Module {
}
