import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private usersUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient, private router: Router) { }

    register(user: User): Observable<Promise<User | undefined>> {
        return this.http.get<User[]>(`${this.usersUrl}?username=${user.username}`).pipe(
            map(users => {
                if (users.length > 0) {
                    throw new Error('Username already exists');
                }
                user.id = this.generateUniqueId();
                return user;
            }),
            catchError(error => throwError(() => new Error(error.message))),
            map(newUser => {
                return this.http.post<User>(this.usersUrl, newUser).toPromise();
            })
        );
    }

    login(username: string, password: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.usersUrl}?username=${username}`).pipe(
            tap(users => {
                if (users.length === 0 || users[0].password !== password) {
                    throw new Error('Invalid username or password');
                }
            }),
            tap(users => {
                localStorage.setItem('currentUser', JSON.stringify(users[0]));
            })
        );
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }

    getCurrentUserId() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        return currentUser?.id || 0;
    }

    private generateUniqueId(): number {
        return Math.floor(Date.now() + Math.random() * 1000);
    }
}
