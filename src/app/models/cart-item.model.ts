// src/app/models/cart-item.model.ts

export class CartItem {
    id: number;
    name: string;
    photoUrl: string;
    price: number;
    quantity: number;
  
    constructor(id: number, name: string, photoUrl: string, price: number, quantity: number) {
      this.id = id;
      this.name = name;
      this.photoUrl = photoUrl;
      this.price = price;
      this.quantity = quantity;
    }
  
    get totalPrice(): number {
      return this.price * this.quantity;
    }
  }
  