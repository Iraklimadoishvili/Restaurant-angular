import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  fullName: string | null = null;
  isLoggedIn: boolean = false;
  private userStateChangedSubscription: Subscription = new Subscription();
  private cartItemCountSubscription: Subscription = new Subscription();
  cartItemCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.fullName = this.authService.getFullName();
    }

    // Subscribe to user state changes
    this.userStateChangedSubscription = this.authService.userStateChanges().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.fullName = this.authService.getFullName();
      } else {
        this.fullName = null;
      }
    });

    // Subscribe to cart item count changes
    this.cartItemCountSubscription = this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  logout(): void {
    this.authService.signOut().subscribe(() => {
      window.location.href = '/sign-in';
    });
  }

  ngOnDestroy(): void {
    if (this.userStateChangedSubscription) {
      this.userStateChangedSubscription.unsubscribe();
    }
    if (this.cartItemCountSubscription) {
      this.cartItemCountSubscription.unsubscribe();
    }
  }
}
