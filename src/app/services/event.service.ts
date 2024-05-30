import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Event } from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private eventsUrl = 'http://localhost:3000/events'; // URL to the mock backend

    constructor(private http: HttpClient, private authService: AuthService) { }

    getEvents(): Observable<Event[]> {
        const userId = this.authService.getCurrentUserId();
        return this.http.get<Event[]>(`${this.eventsUrl}?userId=${userId}`);
    }

    getEvent(id: number): Observable<Event> {
        return this.http.get<Event>(`${this.eventsUrl}/${id}`);
    }

    addEvent(event: Event): Observable<Event> {
        event.id = this.generateUniqueId();  // Generate unique ID for the event
        return this.http.post<Event>(this.eventsUrl, event);
    }

    updateEvent(event: Event): Observable<Event> {
        return this.http.put<Event>(`${this.eventsUrl}/${event.id}`, event);
    }

    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.eventsUrl}/${id}`);
    }

    // deleteEvents(ids: string[]): Observable<void> {
    //     ids.forEach(id => this.http.delete<void>(`${this.eventsUrl}/${id}`).subscribe());
    //     return new Observable(observer => {
    //         observer.next();
    //         observer.complete();
    //     });
    // }

    deleteEvents(ids: string[]): Observable<null> {
        const deleteRequests = ids.map(id => this.deleteEvent(id));
        return forkJoin(deleteRequests).pipe(
            map(() => null) // Convert the array of responses into a single observable
        );
    }

    private generateUniqueId(): string {
        return `${Math.floor(Date.now() + Math.random() * 1000)}`;
    }
}
