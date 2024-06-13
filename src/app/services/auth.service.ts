import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5200/api/Auth';
  private tokenKey = 'token';
  private usernameKey = 'fullName';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private cookieService: CookieService, private cartService: CartService) { }

  private hasToken(): boolean {
    return !!this.cookieService.get(this.tokenKey);
  }

  decodeToken(): any {
    const token = this.cookieService.get(this.tokenKey); // Get token from cookie
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decoding JWT token', error);
      }
    } else {
      console.error('Token not found in cookies');
      return null;
    }
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        const token = response.data;
        const decodedToken: any = jwtDecode(token);
        const fullName = decodedToken.unique_name;
       
        // Store token and fullName in cookies
        this.cookieService.set(this.tokenKey, token, { expires: 1 });
        this.cookieService.set(this.usernameKey, fullName, { expires: 1 });
        this.isLoggedInSubject.next(true);
      })
    );
  }

  signUp(fullName: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { fullName, email, password, confirmPassword }).pipe(
      tap(response => {
        // storing fullName in cookies
        this.cookieService.set(this.usernameKey, fullName);
        console.log(response);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  signOut(): Observable<void> {
    this.cookieService.delete(this.tokenKey); // Remove token cookie
    this.cookieService.delete(this.usernameKey); // Remove fullName cookie
    this.isLoggedInSubject.next(false);
    this.cartService.clearCart();
    return of();
  }

  getToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  getFullName(): string | null {
    const fullName = this.cookieService.get(this.usernameKey);
    return fullName;
  }

  userStateChanges(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
