// models/menu-item.model.ts

export class MenuItem {
    id: number;
    name: string;
    description: string;
    photoUrl: string;
    price: number;
    category: string;
    dietaryRestrictions: string[];
  
    constructor(id: number, name: string, description: string, photoUrl: string, price: number, category: string, dietaryRestrictions: string[]) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.photoUrl = photoUrl;
      this.price = price;
      this.category = category;
      this.dietaryRestrictions = dietaryRestrictions;
    }
  }
  