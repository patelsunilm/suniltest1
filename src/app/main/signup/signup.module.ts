import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { SignupComponent } from 'app/main/signup/signup.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes = [
    {
        path: 'signup',
        component: SignupComponent
    }
];

@NgModule({
    declarations: [
        SignupComponent
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
        BrowserAnimationsModule
    ]
})
export class SignupModule {
}
