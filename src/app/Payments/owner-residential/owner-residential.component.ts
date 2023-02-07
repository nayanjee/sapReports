import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-owner-residential',
  templateUrl: './owner-residential.component.html',
  styleUrls: ['./owner-residential.component.css']
})

export class OwnerResidentialComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  faPlus = faPlus;
  heading = 'Residential Owner List';
  subheading = 'List of all residential owners.';
  icon = 'pe-7s-users text-success';

  limit = 10;
  temp: any = [];
  temp2: any = [];
  owners: any = [];

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
    // this.fetch(data => {
    //   // cache our list
    //   this.temp = [...data];

    //   // push our inital complete list
    //   this.owners = data;
    // });

    this.getOwners();
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
      title: 'Owner status will update!',
      text: 'Are you sure want to change status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let reqData = { _id: id, isActive: val };
        this.apiService.update('/api/lessor/changeStatus', reqData).subscribe((response: any) => {
          if (response.status === 200) {
            this.getOwners();
            Swal.fire(
              'Updated!',
              'The asset status has been updated.',
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

  confirmBoxDelete(id) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let reqData = { _id: id };
        this.apiService.update('/api/lessor/delete', reqData).subscribe((response: any) => {
          if (response.status === 200) {
            this.getOwners();
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

  getOwners() {
    this.apiService.get('/api/lessor/property', 'residential').subscribe((response: any) => {
      console.log(response);
      if (response.status === 200) {
        if (response.data.length) {
          this.temp = response.data;
          this.owners = response.data;
        }
      }
    });
  }

  filterName(event) {
    $('#phone').val('');
    $('#glcode').val('');
    
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.owners = temp;
  }

  filterGlCode(event) {
    $('#name').val('');
    $('#phone').val('');

    const val = event.target.value;

    const temp = this.temp.filter(function (d) {
      return d.glCode.indexOf(val) !== -1 || !val;
    });
    
    this.owners = temp;
  }

  filterPhone(event) {
    $('#name').val('');
    $('#glcode').val('');

    const val = event.target.value;

    const temp = this.temp.filter(function (d) {
      return d.phone.indexOf(val) !== -1 || !val;
    });
    
    this.owners = temp;
  }

  clearAll() {
    $('#name').val('');
    $('#glcode').val('');
    $('#phone').val('');
    this.owners = this.temp;
  }

  redirectPage(page) {
    this.router.navigateByUrl(page);
  }

  viewPopup(content, val) {
    console.log(val);
    const temp = this.temp.filter(function (d) {
      return d._id.indexOf(val) !== -1 || !val;
    });
    this.temp2 = temp;
    console.log(this.temp2);
    this.modalService.open(content, {
      size: 'lg'
    });
  }
}
