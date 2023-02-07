import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ThemeOptions} from '../../../../../theme-options';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {

  constructor(
    private router: Router,
    public globals: ThemeOptions
  ) {
  }

  ngOnInit() {
  }

  logout() {
    localStorage.setItem('laSapUserId', null);
    this.router.navigateByUrl('/login');
  }

}
