import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { ForgotPassword2Component } from 'app/main/forgotpassword/forgot-password-2.component';
import { AutofocusModule } from 'angular-autofocus-fix';

const routes = [
    {
        path: 'forgot-password',
        component: ForgotPassword2Component
    }
];

@NgModule({
    declarations: [
        ForgotPassword2Component
    ],
    imports: [
        RouterModule.forChild(routes),
        AutofocusModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule,
    ]
})
export class ForgotPassword2Module {
}
