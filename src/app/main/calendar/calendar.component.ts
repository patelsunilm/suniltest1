import { Component,Pipe, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { EventFormComponent } from 'app/main/calendar/event-form/event-form.component';
import { DiaryService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
// import { CalendarService } from 'app/main/apps/calendar/calendar.service';
// import { CalendarEventModel } from 'app/main/apps/calendar/event.model';
// import { CalendarEventFormDialogComponent } from 'app/main/apps/calendar/event-form/event-form.component';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormatPipe',
})
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CalendarComponent implements OnInit {
  actions: CalendarEventAction[];
  activeDayIsOpen: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  events: CalendarEvent[];
  refresh: Subject<any> = new Subject();
  selectedDay: any;
  view: string;
  viewDate: Date;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(public snackBar: MatSnackBar,public dialog: MatDialog, private DiaryService : DiaryService,private _matDialog: MatDialog,
  ) {
   // Set the defaults
   this.view = 'month';
   this.viewDate = new Date();
   this.activeDayIsOpen = true;
   this.selectedDay = {date: startOfDay(new Date())};
 /**
     * Constructor
     *
     * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
   this.actions = [
       {
           label  : '<i class="material-icons s-16">edit</i>',
           onClick: ({event}: { event: CalendarEvent }): void => {
               this.editEvent('edit', event);
           }
       },
       {
           label  : '<i class="material-icons s-16">delete</i>',
           onClick: ({event}: { event: CalendarEvent }): void => {
               this.deleteEvent(event);
           }
       }
   ];

   /**
    * Get events from service/server
    */
  //  this.setEvents();


   }

  ngOnInit() {

    var merchantId = localStorage.getItem('userId');
 
    this.DiaryService.getaEventDetails(merchantId)
    .subscribe(
      data => {
      var newevents = []
        data.forEach(element => {
            
            element._id  = element._id;
            element.start = new Date(element.start);
            element.title = element.title;
            element.end = new Date(element.end);
            newevents.push(element)
          });
         
         this.events = newevents;
      },
      error => {

        console.log(error);
      });

     /**
         * Watch re-render-refresh for updating db
         */
         this.refresh.subscribe(updateDB => {
           if ( updateDB )
           {
            //    this._calendarService.updateEvents(this.events);
           }
       });

      //  this._calendarService.onEventsUpdated.subscribe(events => {
      //      this.setEvents();
      //    this.refresh.next();
      // });
  }

 /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void
    {
        event.start = newStart;
        event.end = newEnd;
        // console.warn('Dropped or resized', event);
        this.refresh.next(true);
    }


  setEvents(): void
  {

    
    
    var merchantId = localStorage.getItem('userId');
 
    this.DiaryService.getaEventDetails(merchantId)
    .subscribe(
      data => {
      var newevents = []
        data.forEach(element => {
            
            element._id  = element._id;
            element.start = new Date(element.start);
            element.title = element.title;
            element.end = new Date(element.end);
            newevents.push(element)
          });
         
          
         this.events = newevents;
         
      },
      error => {

        console.log(error);
      });  
    }

  beforeMonthViewRender({header, body}): void
  {
      /**
       * Get the selected day
       */
      const _selectedDay = body.find((_day) => {
          return _day.date.getTime() === this.selectedDay.date.getTime();
      });

      if ( _selectedDay )
      {
          /**
           * Set selected day style
           * @type {string}
           */
          _selectedDay.cssClass = 'cal-selected';
      }

  }
 
  dayClicked(day: CalendarMonthViewDay): void
  {
   
      const date: Date = day.date;
      const events: CalendarEvent[] = day.events;

      if ( isSameMonth(date, this.viewDate) )
      {
          if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
          {
            

              this.activeDayIsOpen = false;
          }
          else
          {
            

              this.activeDayIsOpen = true;
              this.viewDate = date;
          }
      }
      this.selectedDay = day;
      this.refresh.next();
  }


    /**
     * Delete Event
     *
     * @param event
     */
    deleteEvent(event): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
     
      
        this.confirmDialogRef.afterClosed().subscribe(result => {
           
            if ( result )
            {
               
                this.DiaryService.deleteEvents(event._id)
                .subscribe(
                  data => {
        
                  }, error => {
                    console.log(error);
                  });

                const eventIndex = this.events.indexOf(event);
                this.events.splice(eventIndex, 1);
                this.refresh.next(true);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
   
     editEvent(action: string, event: CalendarEvent): void
    {


        
        const eventIndex = this.events.indexOf(event);

        this.dialogRef = this._matDialog.open(EventFormComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                event : event,
                action: action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {

                   
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                if(actionType == "save") {
                    
                  
                  //  if(formData.value.start <= formData.value.end) { 
                    var datePipe = new DatePipe("en-US");
              
                    var myDate = new Date();
                    var newEvents = datePipe.transform(formData.value.start,"yyyy-MM-dd")
                    var currentdate = datePipe.transform(myDate,"yyyy-MM-dd")
    
                    
                    if(currentdate <= newEvents){
                    
                    this.DiaryService.updateEvents(formData.value)
                    .subscribe(
                      data => {
            
                        this.snackBar.open('Event updated successfully.', '', {
                          duration: 5000,
                          horizontalPosition: this.horizontalPosition,
                          verticalPosition: this.verticalPosition,
                      });
            
                      }, error => {
                        console.log(error);
                      });
                   
                    } else {
                      this.snackBar.open('Please select correct date.', '', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                    });
                    var merchantId = localStorage.getItem('userId');
  
                    this.DiaryService.getaEventDetails(merchantId)
                    .subscribe(
                      data => {
                      var newevents = []
                        data.forEach(element => {
                             
                            element.start = new Date(element.start);
                            element.title = element.title;
                            element.end = new Date(element.end);
                            newevents.push(element)
                          });
                         this.events = newevents;
                    
                       },
                      error => {
                
                        console.log(error);
                      });
                    }
                   
                    // }else {
                    //   this.snackBar.open('Please select correct date.', '', {
                    //     duration: 5000,
                    //     horizontalPosition: this.horizontalPosition,
                    //     verticalPosition: this.verticalPosition,
                    // });
                    //  }

                }
               
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());
                        this.refresh.next(true);

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteEvent(event);

                        break;
                }
            });
    }


  addEvent(): void
  {
      this.dialogRef = this._matDialog.open(EventFormComponent, {
          panelClass: 'event-form-dialog',
          data      : {
              action: 'new',
              date  : this.selectedDay.date
          }
      });
      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
              if ( !response )
              {
                  return;
              }
               const newEvent = response.getRawValue();
               newEvent.actions = this.actions;
               var merchantId = localStorage.getItem('userId');
               newEvent.merchantId = merchantId;
           
               if(newEvent.start <= newEvent.end) {
                var datePipe = new DatePipe("en-US");
              
                var myDate = new Date();
                var newEvents = datePipe.transform(newEvent.start,"yyyy-MM-dd")
                var currentdate = datePipe.transform(myDate,"yyyy-MM-dd")

                
                if(currentdate <= newEvents){
                this.DiaryService.addEvent(newEvent)
                .subscribe(
                  data => {
                     var merchantId = localStorage.getItem('userId');
  
                     this.DiaryService.getaEventDetails(merchantId)
                     .subscribe(
                       data => {
                       var newevents = []
                         data.forEach(element => {
                              
                             element.start = new Date(element.start);
                             element.title = element.title;
                             element.end = new Date(element.end);
                             newevents.push(element)
                           });
                          this.events = newevents;
                     
                        },
                       error => {
                 
                         console.log(error);
                       });
                    this.snackBar.open('Event added successfully.', '', {
                      duration: 5000,
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                  });
                  },
                  error => {
          
                    console.log(error);
                  });
                } else {
                  this.snackBar.open('Please select correct date.', '', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });
                }
               } else {
                this.snackBar.open('Please select correct date.', '', {
                  duration: 5000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
              });
               }
   
          });
  }
}
