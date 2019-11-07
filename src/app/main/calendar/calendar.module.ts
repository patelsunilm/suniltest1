import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { CalendarComponent } from 'app/main/calendar/calendar.component';
// import { CalendarService } from 'app/main/apps/calendar/calendar.service';
//  import { EventFormComponent } from 'app/main/calendar/event-form/event-form.component';

// 
import { AuthGuardCo } from './../../_guards/index';
import { EventFormComponent } from './event-form/event-form.component';


const routes = [
    {
        path: 'diary',
        component: CalendarComponent,
         canActivate: [AuthGuardCo]

    }
];


@NgModule({
    declarations   : [
        CalendarComponent,
        EventFormComponent,
        // CalendarEventFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,

        AngularCalendarModule.forRoot({
            provide   : DateAdapter,
            useFactory: adapterFactory
        }),
        ColorPickerModule,
        FuseSharedModule,
        FuseConfirmDialogModule
    ],
    providers      : [
        // CalendarService
    ],
    entryComponents: [
        EventFormComponent    ]
})
export class CalendarModule
{
}
