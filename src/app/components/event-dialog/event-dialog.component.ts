import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent {
  eventForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event,
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.eventForm = this.fb.group({
      id: [data.id],
      title: [data.title || '', Validators.required],
      description: [data.description || ''],
      date: [data.date || '', Validators.required],
      location: [data.location || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const event = this.eventForm.value;
      if (event.id) {
        this.eventService.updateEvent(event).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        event.userId = this.authService.getCurrentUserId();
        this.eventService.addEvent(event).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
