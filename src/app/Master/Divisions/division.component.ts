import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})

export class DivisionComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  loggedUserId: any = '';
  faPlus = faPlus;
  heading = 'Divisions';
  subheading = 'List of all divisions.';
  icon = 'pe-7s-users text-success';

  limit = 10;
  temp: any = [];
  records: any = [];

  temp2: any = [];
  owners: any = [];
  currentUser: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private apiService: AppServicesService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      //this.type = params.type;
      console.log('params---', params);
    });
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login'); 

    this.getDivisions();
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

  confirmBoxStatus(id, val) {
    Swal.fire({
      title: 'Division status will update!',
      text: 'Are you sure want to change status? If yes, It will not appear in any list.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let reqData = { _id: id, status: val };
        this.apiService.update('/api/division/changeStatus', reqData).subscribe((response: any) => {
          if (response.status === 200) {
            this.getDivisions();
            Swal.fire(
              'Updated!',
              'The division status has been updated.',
              'success'
            )
          } else {
            this.toast('error', 'Something went wrong try again to change status.')
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary record is safe :)',
          'error'
        )
      }
    })
  }

  confirmBoxDelete(id, status) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record! All assets of this owner will also be removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let reqData = { _id: id };
        this.apiService.update('/api/lessor/delete', reqData).subscribe((response: any) => {
          if (response.status === 200) {
            //this.getOwners();
            Swal.fire(
              'Deleted!',
              'Your imaginary record has been deleted.',
              'success'
            )
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary record is safe :)',
          'error'
        )
      }
    })
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `http://swimlane.github.io/ngx-datatable/assets/data/company.json`);

    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };

    req.send();
  }

  getDivisions() {
    this.apiService.get('/api/divisions', '').subscribe((response: any) => {
      console.log(response);
      if (response.status === 200) {
        if (response.data.length) {
          this.temp = response.data;
          this.records = response.data;
        }
      }
    });
  }

  filterName(event) {
    $('#division').val('');
    
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.records = temp;
  }

  filterDivision(event) {
    $('#name').val('');

    const val = event.target.value;
    const temp = this.temp.filter(function (d) {
      return d.division.toString().indexOf(val) !== -1 || !val;
    });
    
    this.records = temp;
  }

  clearAll() {
    $('#name').val('');
    $('#division').val('');
    this.records = this.temp;
  }

  redirectPage(page) {
    this.router.navigateByUrl(page);
  }

  addPopup(content) {
    this.modalService.open(content, {
      size: 'md'
    });
  }

  onSubmit() {
    let error = 0;
    const name = $('#dname').val();
    const code = $('#dcode').val();
    console.log('---', name, code);
    if (name == '') {
      error = 1;
      $('#errdname').text('This field is required.');
      $('#errdname').show();
    }

    if (code != '') {
      var pattern = /^\d+$/;
      if (pattern.test(code)) {

      } else {
        error = 1;
        $('#errdcode').text('It must be a number only.');
        $('#errdcode').show();
      }
    } else {
      error = 1;
      $('#errdcode').text('This field is required.');
      $('#errdcode').show();
    }

    if (error === 0) {
      const reqData = {
        name: name,
        code: code
      }
      this.apiService.post('/api/division/create', reqData).subscribe((response: any) => {
        if (response.status === 200) {

        }
      });
    }
  }
}
