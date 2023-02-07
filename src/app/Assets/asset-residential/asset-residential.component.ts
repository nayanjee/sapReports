import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-asset-residential',
  templateUrl: './asset-residential.component.html',
  styleUrls: ['./asset-residential.component.css']
})

export class AssetResidentialComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  loggedUserId: any = '';

  faPlus = faPlus;
  heading = 'Residential Flats';
  subheading = 'List of all residential flats.';
  icon = 'pe-7s-users text-success';

  limit = 10;
  temp: any = [];
  temp2: any = [];
  assets: any = [];
  assetId: string = '';
  closeResult: string = '';
  confirmText: string = '';
  statusValue: number = 0;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private apiService: AppServicesService
  ) {
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login');

    this.getAssets();
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

  confirmBoxStatus(id, val, ownerId) {
    Swal.fire({
      title: 'Asset status will update!',
      text: 'Are you sure want to change status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let reqData = { _id: id, isActive: val, ownerId: ownerId };
        this.apiService.update('/api/asset/changeAssetStatus', reqData).subscribe((response: any) => {
          if (response.status === 200) {
            if (response.message === 'ownerInactive') {
              Swal.fire(
                'Not Updated!',
                'The owner is inactive, if you want to modify then activate the owner first.',
                'error'
              )
            } else {
              this.getAssets();
              Swal.fire(
                'Updated!',
                'The asset status has been updated.',
                'success'
              )
            }
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

  confirmBoxFlat(id, val) {
    Swal.fire({
      title: 'Occupancy status will update!',
      text: 'Are you sure want to change occupancy status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        let reqData = { _id: id, isOccupied: val };
        this.apiService.update('/api/asset/changeFlatStatus', reqData).subscribe((response: any) => {
          if (response.status === 200) {
            this.getAssets();
            Swal.fire(
              'Updated!',
              'The occupancy status has been updated.',
              'success'
            )
          } else {
            this.toast('error', 'Something went wrong try again to change occupancy status.')
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
        this.apiService.update('/api/asset/deleteFlat', reqData).subscribe((response: any) => {
          if (response.status === 200) {
            this.getAssets();
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

  getAssets() {
    this.apiService.get('/api/asset/propertyFull', 'residential').subscribe((response: any) => {
      if (response.status === 200) {
        if (response.data.length) {
          this.temp = response.data;
          this.assets = response.data;
        }
      }
    });
  }

  filterName(event) {
    $('#phone').val('');
    $('#flatno').val('');

    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.allotee.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.assets = temp;
  }

  filterFlat(event) {
    $('#name').val('');
    $('#expire').val('');

    const val = event.target.value;

    const temp = this.temp.filter(function (d) {
      return d.flatNo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.assets = temp;
  }

  filterExpire(event) {
    $('#name').val('');
    $('#flatno').val('');

    const val = event.target.value;

    const temp = this.temp.filter(function (d) {
      return d.agreementExpiryDate.indexOf(val) !== -1 || !val;
    });

    this.assets = temp;
  }

  clearAll() {
    $('#name').val('');
    $('#flatno').val('');
    $('#expire').val('');
    this.assets = this.temp;
  }

  redirectPage(page) {
    console.log(page);
    this.router.navigateByUrl(page);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  viewPopup(content, val) {
    const temp = this.temp.filter(function (d) {
      return d._id.indexOf(val) !== -1 || !val;
    });
    this.temp2 = temp;
    this.modalService.open(content, {
      size: 'lg'
    });
  }
}
