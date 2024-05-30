import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { EventDialogComponent } from 'src/app/components/event-dialog/event-dialog.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EventListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'title', 'date', 'location', 'actions'];
  dataSource = new MatTableDataSource<Event>();
  selection = new SelectionModel<Event>(true, []);
  expandedElement: Event | null | undefined;

  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;

  constructor(private eventService: EventService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadEvents();
    this.dataSource.sort = this.sort;
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.dataSource.data = events;
    });
  }

  openEventDialog(event?: Event): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: event ? { ...event } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (event) {
          this.snackBar.open('Event updated successfully', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Event added successfully', 'Close', { duration: 3000 });
        }
        this.loadEvents();
      }
    });
  }

  deleteEvent(event: Event): void {
    this.eventService.deleteEvent(event.id).subscribe(() => {
      this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
      this.loadEvents();
    });
  }

  deleteSelectedEvents(): void {
    const selectedIds = this.selection.selected.map(event => event.id);
    this.eventService.deleteEvents(selectedIds).subscribe(() => {
      this.snackBar.open('Selected events deleted successfully', 'Close', { duration: 3000 });
      this.loadEvents();
      this.selection.clear();
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data);
  }

  toggleRow(event: Event): void {
    this.expandedElement = this.expandedElement === event ? null : event;
  }

  // isExpanded = (row: Event): boolean => this.expandedElement === row;
}
