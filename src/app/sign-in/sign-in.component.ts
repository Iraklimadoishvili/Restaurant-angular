import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink,CommonModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  //formgroup instance to manage sign-in form
signInForm!:FormGroup;
  constructor(private authService:AuthService,private router :Router,private formBuilder :FormBuilder){}
  

  ngOnInit():void{
    //form controls and validators
    this.signInForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      password :['',[Validators.required]]
    });
  }

  onSubmit():void{
    //check if the form is valid before submitting
    if(this.signInForm.valid){
      const{email,password} = this.signInForm.value;//get email and password from the form
      this.authService.signIn(email,password).subscribe(
        response => {
          console.log(response);
          this.router.navigate(['']);
        },
        error =>{
          console.error('sign-in error',error);
          if (error.status === 400 && error.error && error.error.errors && error.error.errors.Email) {
            console.error('Validation errors for email:', error.error.errors.Email);
          } else {
            console.error('An error occurred during sign-in:', error);
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}

