import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5200/api/cart';
  private cartItemCount = new BehaviorSubject<number>(0);
  private cartItems: CartItem[] = [];

  constructor(private http: HttpClient) {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.cartItemCount.next(this.cartItems.length);
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  addToCart(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, item).pipe(
      tap(() => {
        this.cartItems.push(item);
        this.cartItemCount.next(this.cartItems.length);
      })
    );
  }

  removeCartItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.cartItemCount.next(this.cartItems.length);
      })
    );
  }

  updateCartItem(item: CartItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${item.id}`, item).pipe(
      tap(() => {
        const index = this.cartItems.findIndex(i => i.id === item.id);
        if (index > -1) {
          this.cartItems[index] = item;
        }
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        this.cartItems = [];
        this.cartItemCount.next(0);
      })
    );
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }
}
