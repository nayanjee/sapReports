import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppServicesService } from './../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-login-boxed',
  templateUrl: './login-boxed.component.html',
  styles: []
})
export class LoginBoxedComponent implements OnInit {
  loggedUserId: any = '';
  loginForm:any =  FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: AppServicesService
  ) { }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laSapUserId');
    if (this.loggedUserId != 'null') {
      this.router.navigateByUrl('/');
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
        return;
    }
    
    if(this.submitted) {
      console.log(this.loginForm.value);
      const reqData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        portal: 'sapReport'
      }
      this.apiService.post('/api/auth/signin', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          console.log(response.data.id);
          localStorage.setItem('laSapUserId', response.data.id);
          // localStorage.setItem('userToken', JSON.stringify(response.token));
          this.router.navigateByUrl('/dashboard');
          this.loginForm.reset();
        } else {
          if (response.status === 400) {
            $('#errmsg').show();
            $('#errmsg').html(response.message);
          } else {
            $('#errmsg').show();
            $('#errmsg').html('Something went wrong please try again.');
          }
          localStorage.setItem('laSapUserId', null);
          // localStorage.setItem('userToken', null);
          // JSON.parse(localStorage.getItem('userToken'));
        }
      }, (errorResult) => {
        this.errorHandling(errorResult);
      });
    }
  
  }

  errorHandling(error: any) {
    try {
      // this.isLoading = false;
      const errorObj = error ? JSON.parse(error) : '';
      //this.toastr.error(errorObj.message, 'Error');
    } catch (error) {
      //this.toastr.error(error.message, 'Error');
    }
  }
}
