import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItem } from '../models/menu-item.model';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
    // Properties to hold menu items and filtered menu items
  menuItems: MenuItem[] = [];
  filteredMenuItems: MenuItem[] = [];
    // Properties to hold selected categories and dietary restrictions
  selectedCategories: string[] = [];
  selectedDietaryRestrictions: string[] = [];
    // Boolean to track whether to show filtered items
  showFilteredItems: boolean = false;

  constructor(private apiService: ApiService, private cartService: CartService) {}
 // Lifecycle hook to initialize the component
  ngOnInit(): void {
    this.getMenuItems();
  }

 // Method to fetch menu items from the API
  getMenuItems(): void {
    this.apiService.getMenuItems().subscribe(
      (data: MenuItem[]) => {
        this.menuItems = data;
        this.filteredMenuItems = data; // Initialize filtered items
      },
      (error: any) => {
        console.error('Error fetching menu items', error);
      }
    );
  }

  // Method to apply selected filters to the menu items
  applyFilters(): void {
    this.filteredMenuItems = this.menuItems.filter(item => {
      // Filter menu items based on selected categories and dietary restrictions
      const categoryMatch = this.selectedCategories.length === 0 || this.selectedCategories.includes(item.category);
      const restrictionMatch = this.selectedDietaryRestrictions.length === 0 || 
                                this.selectedDietaryRestrictions.some(diet => item.dietaryRestrictions.includes(diet));
      return categoryMatch && restrictionMatch;
    });
  }

// Method to handle changes in the category filter checkboxes
  onCategoryChange(event: any): void {
    const checkboxValue = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(checkboxValue);
    } else {
        // Remove the category from the selected categories if unchecked
      const index = this.selectedCategories.indexOf(checkboxValue);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  onDietChange(event: any): void {
    const checkboxValue = event.target.value;
    if (event.target.checked) {
      this.selectedDietaryRestrictions.push(checkboxValue);
    } else {
      const index = this.selectedDietaryRestrictions.indexOf(checkboxValue);
      if (index !== -1) {
        this.selectedDietaryRestrictions.splice(index, 1);
      }
    }
  }

  addToCart(item: MenuItem): void {
    this.cartService.getCartItems().subscribe((cartItems) => {
      const existingItem = cartItems.find(cartItem => cartItem.name === item.name);

      if (existingItem) {
        existingItem.quantity += 1;
        this.cartService.updateCartItem(existingItem).subscribe(
          () => 
          (error: any) => console.error('Error updating quantity', error)
        );
      } else {
        const cartItem: CartItem = {
          id: 0, // The backend should assign a unique ID
          name: item.name,
          photoUrl: item.photoUrl,
          price: item.price,
          quantity: 1,
          totalPrice: item.price // Not necessary, but just to be clear
        };
        this.cartService.addToCart(cartItem).subscribe(
          (addedItem: CartItem) => 
          (error: any) => console.error('Error adding item to cart', error)
        );
      }
    });
  }
}