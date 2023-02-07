import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AppServicesService } from './../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  loggedUserId: any = '';
  faPlus = faPlus;
  heading = 'Payment List';
  subheading = 'Month wise rent payment details';
  icon = 'pe-7s-users text-success';

  limit = 10;
  temp: any = [];
  assets: any = [];
  records: any = [];
  nextYear: any;
  currentYear: any;
  currentMonth: any;
  selectedAssetData: any;
  btnLoader = false;
  modalReference: any;
  closeResult: any;
  clickedValue: any;
  enterPress: boolean = false;


  constructor(
    private router: Router,
    private modalService: NgbModal,
    private apiService: AppServicesService
  ) {
    var d = new Date();
    this.currentYear = d.getFullYear();
    this.currentMonth = d.getMonth();
    this.nextYear = parseInt(this.currentYear) + 1;
    this.currentMonth = parseInt(this.currentMonth) + 1;
    console.log(this.currentMonth);
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login'); 
    
    this.getPayments();
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

  getPayments() {
    const financialYear = '2022-2023';
    this.apiService.get('/api/rental_payment/payments', financialYear).subscribe((response: any) => {
      if (response.status === 200) {
        if (response.data.length) {
          this.temp = response.data;
          this.records = response.data;
        }
        $('#loader').hide();
        $('.mytable').show();
      }
    });
  }

  chequeClick(event, month, paymentId) {
    this.clickedValue = event.target.attr;
    this.hideInput();
    $('#chkamt_' + month + '_' + paymentId).hide();
    $('#chktxt_' + month + '_' + paymentId).show();
    $('#chk_input_' + month + '_' + paymentId).focus();
  }

  chequeInput(event, month, year, paymentId) {
    if (!this.enterPress) {
      if (event.keyCode === 13 && event.code === 'Enter') {
        this.enterPress = true;
        if (event.target.value) {
          var pattern = /^\d+$/;

          if (event.target.value === this.clickedValue) {
            $('#chkamt_' + month + '_' + paymentId).text(event.target.value);
            $('#chkamt_' + month + '_' + paymentId).show();
            $('#chktxt_' + month + '_' + paymentId).hide();
            this.toast('success', 'Successfully Updated.');
            this.enterPress = false;
          } else if (
            pattern.test(event.target.value) &&
            event.target.value > 999 &&
            event.target.value < 1000000
          ) {
            const reqData = {
              _id: paymentId,
              chequeNo: event.target.value
            };

            this.apiService.update('/api/rental_payment/updateCheque', reqData).subscribe((response: any) => {
              if (response.status === 200) {
                if (response.data) {
                  if (response.message === 'success') {
                    // $('#chkamt_' + month + '_' + paymentId).text(this.clickedValue);
                    // $('#chkamt_' + month + '_' + paymentId).show();
                    // $('#chktxt_' + month + '_' + paymentId).hide();
                    Swal.fire('Exists', 'Entered Cheque No. already on record.', 'error');
                  } else if (response.message === 'successfullyUpdated') {
                    this.getPayments();
                    this.toast('success', 'Successfully Updated.');
                    
                    // $('#chkamt_' + month + '_' + paymentId).text(event.target.value);
                    // $('#chkamt_' + month + '_' + paymentId).show();
                    // $('#chktxt_' + month + '_' + paymentId).hide();
                  }
                } else {
                  // $('#chkamt_' + month + '_' + paymentId).text(this.clickedValue);
                  // $('#chkamt_' + month + '_' + paymentId).show();
                  // $('#chktxt_' + month + '_' + paymentId).hide();
                  this.getPayments();
                  this.toast('error', 'Something went wrong try again later.');
                }
              }
              this.enterPress = false;
            });
          } else {
            this.toast('error', 'Enter a valid cheque no.');
            this.enterPress = false;
          }
        } else {
          // you can update blank value
          this.enterPress = false;
        }
      } else if (event.keyCode === 27 && event.code === 'Escape') {
        $('#chkamt' + month + '_' + paymentId).text(this.clickedValue);
        $('#chkamt' + month + '_' + paymentId).show();
        $('#chktxt' + month + '_' + paymentId).hide();
        this.enterPress = false;
      }
    }
  }

  amountClick(event, month, paymentId) {
    this.clickedValue = event.target.attr;
    this.hideInput();
    $('#amtamt_' + month + '_' + paymentId).hide();
    $('#amttxt_' + month + '_' + paymentId).show();
    $('#amt_input_' + month + '_' + paymentId).focus();
  }

  amountInput(event, month, year, paymentId) {
    if (event.keyCode === 13 && event.code === 'Enter') {
      this.enterPress = true;
      if (event.target.value) {
        var pattern = /^\d+$/;

        if (event.target.value === this.clickedValue) {
          $('#amtamt_' + month + '_' + paymentId).text(event.target.value);
          $('#amtamt_' + month + '_' + paymentId).show();
          $('#amttxt_' + month + '_' + paymentId).hide();
          this.toast('success', 'Successfully Updated.');
          this.enterPress = false;
        } else if (pattern.test(event.target.value)) {
          const reqData = {
            _id: paymentId,
            amount: event.target.value
          };
          console.log('reqData--', reqData);
          this.apiService.update('/api/rental_payment/updateAmount', reqData).subscribe((response: any) => {
            if (response.status === 200) {
              if (response.data) {
                if (response.message === 'successfullyUpdated') {
                  this.getPayments();
                  this.toast('success', 'Successfully Updated.');
                  // $('#amtamt_' + month + '_' + paymentId).text(event.target.value);
                  // $('#amtamt_' + month + '_' + paymentId).show();
                  // $('#amttxt_' + month + '_' + paymentId).hide();
                }
              } else {
                // $('#amtamt_' + month + '_' + paymentId).text(this.clickedValue);
                // $('#amtamt_' + month + '_' + paymentId).show();
                // $('#amttxt_' + month + '_' + paymentId).hide();
                this.getPayments();
                this.toast('error', 'Something went wrong try again later.');
              }
            }
          });
          this.enterPress = false;
        } else {
          this.toast('error', 'Enter a valid amount');
          this.enterPress = false;
        }
      } else {
        // update blank value
        this.enterPress = false;
      }
    } else if (event.keyCode === 27 && event.code === 'Escape') {
      $('#amtamt' + month + '_' + paymentId).text(this.clickedValue);
      $('#amtamt' + month + '_' + paymentId).show();
      $('#amttxt' + month + '_' + paymentId).hide();
      this.enterPress = false;
    }
  }

  hideInput() {
    $('.amount_text').show();
    $('.amount_input').hide();
  }

  filterName(event) {
    $('#phone').val('');
    $('#glcode').val('');

    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.owner.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.records = temp;
  }

  filterGlCode(event) {
    $('#name').val('');
    $('#phone').val('');

    const val = event.target.value;

    const temp = this.temp.filter(function (d) {
      return d.owner.glCode.indexOf(val) !== -1 || !val;
    });

    this.records = temp;
  }

  filterFlat(event) {
    $('#name').val('');
    $('#glcode').val('');

    const val = event.target.value.toLowerCase();;

    const temp = this.temp.filter(function (d) {
      return d.asset.flatNo.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.records = temp;
  }

  clearAll() {
    $('#name').val('');
    $('#glcode').val('');
    $('#phone').val('');
    this.records = this.temp;
  }

  redirectPage(page) {
    this.router.navigateByUrl(page);
  }

  viewPopup(content) {
    // this.modalService.open(content, {
    //   size: 'lg'
    // });
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  changePropertyType(event) {
    const val = event.target.value.toLowerCase();
    this.getAsset(val);
  }

  changeAsset(event) {
    const val = event.target.value;
    $("#month option[value=" + this.currentMonth + "]").attr("selected", "selected");

    if (this.currentMonth < 4) {
      $('#year').val(this.nextYear);
    } else {
      $('#year').val(this.currentYear);
    }

    const temp = this.assets.filter(function (d) {
      return d._id.indexOf(val) !== -1 || !val;
    });
    this.selectedAssetData = temp[0];
    $('#amount').val(temp[0].rentAmount);
  }

  changeMonth(event) {
    const val = event.target.value;
    if (val < 4) {
      $('#year').val(this.nextYear);
    } else {
      $('#year').val(this.currentYear);
    }
  }

  getAsset(val) {
    this.apiService.get('/api/asset/property', val).subscribe((response: any) => {
      if (response.status === 200) {
        this.assets = response.data;
      }
    });
  }

  onSubmit() {
    $('#errtype').hide();
    $('#errasset').hide();
    let error = 0;
    const type = $('#type').val();
    const assetId = $('#asset').val();

    if (!type) {
      error = 1;
      $('#errtype').show();
    }

    if (!assetId) {
      error = 1;
      $('#errasset').show();
    }

    if (!error) {
      this.btnLoader = true;

      const reqData = {
        assetId: this.selectedAssetData._id,
        ownerId: this.selectedAssetData.ownerId,
        year: this.currentYear
      }

      this.apiService.post('/api/rental_payment/create', reqData).subscribe((response: any) => {
        console.log('response---', response);
        if (response.status === 200) {
          this.btnLoader = false;

          this.modalReference.close();

          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          this.toast('success', 'Successfully Added!');
        }
      });
    }
  }
}
