import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ProductService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-tillmanagement',
  templateUrl: './tillmanagement.component.html',
  styleUrls: ['./tillmanagement.component.scss'],
  animations: fuseAnimations
})
export class TillmanagementComponent implements OnInit {
  displayedColumns: string[] = [ 'action'];
  dataSource;
  form: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
