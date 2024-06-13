import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';

export const routes: Routes = [
    {path:'' ,component:HomeComponent},
    {path:'menu', component:MenuComponent},
    {path:'cart',component:CartComponent},
    {path:'about-us',component:AboutUsComponent},
    {path:'sign-in',component:SignInComponent},
    {path:'sign-up',component:SignUpComponent},
    {path:'checkout-dialog',component:CheckoutDialogComponent},
];

