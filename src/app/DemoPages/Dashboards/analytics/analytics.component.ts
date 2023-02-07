import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTh, faCheck, faTrash, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AppServicesService } from './../../../shared/service/app-services.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  temp: any = [];
  loggedUserId: any = '';

  constructor(
    private router: Router,
    private apiService: AppServicesService
  ) {
    
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laSapUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login'); 

    //this.getAssets();
  }

  toast(typeIcon, message) {
    // typeIcon = error, success, warning, info, question
    Swal.fire({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      icon: typeIcon,
      timerProgressBar: true,
      timer: 5000,
      title: message
    })
  }

  /* getAssets() {
    this.apiService.fetch('/api/asset/all').subscribe((response: any) => {
      if (response.status === 200) {
        if (response.data.length) {
          this.temp = response.data
          this.assets = response.data;
          this.commercialAssets();
          this.residentialAssets();
          this.residentialOccupied();
        }
      }
    });
  } */
  
  downloadFile() {
    alert('Work in progress.');
  }
}
