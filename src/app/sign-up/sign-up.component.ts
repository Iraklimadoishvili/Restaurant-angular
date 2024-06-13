import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { response } from 'express';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink,CommonModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
signupForm :FormGroup;

constructor(private fb:FormBuilder,private authService :AuthService,private router:Router){
  this.signupForm = this.fb.group({
    fullName:['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });
}

ngOnInit(): void {

}

onSubmit(){
  if(this.signupForm.valid){
    const fullName = this.signupForm.value.fullName;
    const email  = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const confirmPassword = this.signupForm.value.confirmPassword;

    this.authService.signUp(fullName, email, password, confirmPassword).subscribe(
      (response: any) => {
        
        // Handle the response appropriately
        console.log(response); // Check the structure of the response
        // Optionally, you can extract data from the response and store it in local storage
        // For example:
        // const userFullName = response.data.fullName;
        // localStorage.setItem('currentUser', userFullName);
        // Then, navigate to the main page or any other page
        this.router.navigate(['']);
      },
      (error: any) => {
        console.error('Error occurred during signup:', error);
        // Handle error if needed
      }
    );
  } else {
    this.signupForm.markAllAsTouched();
  }
}
}