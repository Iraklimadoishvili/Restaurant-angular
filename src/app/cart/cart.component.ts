import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import{MatDialog} from "@angular/material/dialog"
import { CheckoutDialogComponent } from '../checkout-dialog/checkout-dialog.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink,HttpClientModule,CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []; // Declare cartItems property and initialize it as an empty array
 isLoggedIn :boolean = false;
 private authSubscription!:Subscription;
  constructor(private cartService: CartService,private authService:AuthService,private dialog:MatDialog,private router:Router) { }

  ngOnInit(): void {
    this.getCartItems();
  this.authSubscription = this.authService.userStateChanges().subscribe(LoggedIn =>{
  this.isLoggedIn = LoggedIn;
  })
  }

  ngOnDestroy():void{
    if(this.authSubscription){
      this.authSubscription.unsubscribe();
    }
  }
  getCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (items: CartItem[]) => {
        this.cartItems = items;
      },
      (error: any) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  
  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateCartItem(item);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItem(item);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeCartItem(item.id).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(i => i !== item);
      },
      (error: any) => {
        console.error('Error removing item from cart', error);
      }
    );
  }

  updateCartItem(item: CartItem): void {
    this.cartService.updateCartItem(item).subscribe(
      () => {
        // Cart item updated successfully
      },
      (error: any) => {
        console.error('Error updating cart item', error);
      }
    );
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  checkout(): void {
    if (this.isLoggedIn) {
      const dialogRef = this.dialog.open(CheckoutDialogComponent, {
        data: { message: 'Checkout successful!' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cartService.clearCart().subscribe(() => {
            this.cartItems = [];
            console.log('Cart cleared after successful checkout.');
          }, (error: any) => {
            console.error('Error clearing the cart', error);
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(CheckoutDialogComponent, {
        data: { message: 'You need to log in to checkout. Do you want to log in now?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/sign-in']);
        }
      });
    }
  }
}