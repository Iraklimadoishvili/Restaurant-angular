import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItem } from '../models/menu-item.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet,HttpClientModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  menuItems: MenuItem[];

  constructor(private apiService: ApiService) {
    this.menuItems = [];
  }

  ngOnInit(): void {
    this.getMenuItems();
  }

  getMenuItems(): void {
    this.apiService.getMenuItems().subscribe(
      (data: MenuItem[]) => {
        this.menuItems = data;
      },
      (error: any) => {
        console.error('Error fetching menu items', error);
      }
    );
  }
}