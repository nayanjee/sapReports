import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-owner-update',
  templateUrl: './owner-update.component.html',
  styleUrls: ['./owner-update.component.css']
})
export class OwnerUpdateComponent implements OnInit {
  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Update owner';
  subheading = 'Update a Commercial or Residential Owner.';
  icon = 'pe-7s-user icon-gradient bg-premium-dark';

  myForm: FormGroup;
  type: string = '';
  ownerPercent = '';
  submitted = false;
  btnLoader = false;
  coOwnersId: any = [];
  ownerId: string = '';
  selectedType: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: AppServicesService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.oid) this.ownerId = params.oid;
    });
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login'); 
    
    this.createForm();
    this.getOwner();
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

  get f() { return this.myForm.controls; }

  createForm() {
    this.myForm = this.fb.group({
      name:     ['', [Validators.required]],
      glcode:   ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[0-9]*$/)]],
      ifsc:     ['', [Validators.required]],
      account:  ['', [Validators.required]],
      phone:    ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      altphone: [''],
      type:     ['', [Validators.required]],
      isco:     ['', [Validators.required]],
      opercent: ['100', [Validators.required, Validators.pattern(/^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?)$/)]],
      coowners: this.fb.array([]),
    });
  }

  getOwner() {
    if (this.ownerId) {
      this.apiService.get('/api/lessor', this.ownerId).subscribe((response: any) => {
        if (response.status === 200) {
          this.myForm.controls['name'].setValue(response.data.name, { onlySelf: true });
          this.myForm.value.name = response.data.name;

          this.myForm.controls['glcode'].setValue(response.data.glCode, { onlySelf: true });
          this.myForm.value.glcode = response.data.glCode;

          this.myForm.controls['ifsc'].setValue(response.data.ifsc, { onlySelf: true });
          this.myForm.value.ifsc = response.data.ifsc;

          this.myForm.controls['account'].setValue(response.data.accountNo, { onlySelf: true });
          this.myForm.value.account = response.data.accountNo;

          this.myForm.controls['phone'].setValue(response.data.phone, { onlySelf: true });
          this.myForm.value.phone = response.data.phone;

          this.myForm.controls['altphone'].setValue(response.data.altPhone, { onlySelf: true });
          this.myForm.value.altphone = response.data.altPhone;

          //this.selectedCity = response.data.cityId;

          this.myForm.controls['type'].setValue(response.data.propertyType, { onlySelf: true });
          this.myForm.value.type = response.data.propertyType;

          this.myForm.controls['opercent'].setValue(response.data.percentage, { onlySelf: true });
          this.myForm.value.opercent = response.data.percentage;

          let isPartner = 0;
          if (response.data.isPartner) {
            isPartner = 1;

            // Fetch co-owner if exists
            this.apiService.get('/api/coowner', this.ownerId).subscribe((resp: any) => {
              if (response.status === 200) {
                if (resp.data.length > 0) {
                  (resp.data).forEach(element => {
                    const coOwnerData = this.fb.group({
                      coid: element._id,
                      coname: element.name,
                      coglcode: element.glCode,
                      coifsc: element.ifsc,
                      coaccount: element.accountNo,
                      cophone: element.phone,
                      coaltphone: element.altPhone,
                      copercent: element.percentage
                    })
                    
                    this.coowners().push(coOwnerData);
                    this.coOwnersId.push(element._id);
                  });
                }
              }
            });
            $('.showcoowner').show();
          }
          this.myForm.controls['isco'].setValue(isPartner, { onlySelf: true });
          this.myForm.value.isco = isPartner;
        }
      });
    } else {
      this.router.navigateByUrl('/dashboard');
      this.toast('success', 'Something went wrong try again to update asset!');
    }
  }

  coowners(): FormArray {
    return this.myForm.get("coowners") as FormArray
  }

  newCoOwner(): FormGroup {
    return this.fb.group({
      coid: '',
      coname: '',
      coglcode: '',
      coifsc: '',
      coaccount: '',
      cophone: '',
      coaltphone: '',
      copercent: ''
    })
  }

  addCoOwner() {
    this.ownerPercent = this.myForm.value.opercent;

    this.coowners().push(this.newCoOwner());
  }

  removeCoOwner(i: number) {
    this.coowners().removeAt(i);
  }

  onSubmit() {
    this.submitted = true;
    this.btnLoader = true;
    let errorMsg = '';
    let validationError = false;

    if (this.myForm.valid) {
      if (this.myForm.value.altphone != '') {
        var pattern = /^\d+$/;
        if (pattern.test(this.myForm.value.altphone)) {
          if ((this.myForm.value.altphone).toString().length != 10) {
            validationError = true;
            $('#altphone').addClass('is-invalid');
            $('#erraltphone').text('The value must be 10 digit.');
            $('#erraltphone').show();
          }
        } else {
          validationError = true;
          $('#altphone').addClass('is-invalid');
          $('#erraltphone').text('It must be a number only.');
          $('#erraltphone').show();
        }
      }

      if (this.myForm.value.isco != '' && this.myForm.value.isco == 0 && this.myForm.value.opercent != '') {
        if (this.myForm.value.opercent < 100) {
          errorMsg += '&#10148; <u>Is Co-Owner</u> & <u>Owner Percentage</u> &#10171; It seems something went wrong. Have a look at this.<br>';
        }
      } else if (this.myForm.value.isco == 1) {
        if (this.myForm.value.coowners.length) {
          let totalPercent = parseFloat(this.myForm.value.opercent);
          (this.myForm.value.coowners).forEach(async (element, index) => {
            totalPercent = parseFloat(element.copercent) + totalPercent;

            $('#errconame' + index).hide();
            $('#errcoifsc' + index).hide();
            $('#errcophone' + index).hide();
            $('#errcoglcode' + index).hide();
            $('#errcoaccount' + index).hide();
            $('#errcopercent' + index).hide();
            $('#errcoaltphone' + index).hide();
            $('#coname' + index).removeClass('is-invalid');
            $('#coifsc' + index).removeClass('is-invalid');
            $('#cophone' + index).removeClass('is-invalid');
            $('#coglcode' + index).removeClass('is-invalid');
            $('#coaccount' + index).removeClass('is-invalid');
            $('#copercent' + index).removeClass('is-invalid');
            $('#coaltphone' + index).removeClass('is-invalid');

            if (element.coname == '') {
              validationError = true;
              $('#coname' + index).addClass('is-invalid');
              $('#errconame' + index).text('This field is required.');
              $('#errconame' + index).show();
            }

            if (element.coglcode == '') {
              validationError = true;
              $('#coglcode' + index).addClass('is-invalid');
              $('#errcoglcode' + index).text('This field is required.');
              $('#errcoglcode' + index).show();
            } else {
              var pattern = /^\d+$/;
              if (pattern.test(element.coglcode)) {
                if ((element.coglcode).toString().length != 6) {
                  validationError = true;
                  $('#coglcode' + index).addClass('is-invalid');
                  $('#errcoglcode' + index).text('The value must be 6 digit.');
                  $('#errcoglcode' + index).show();
                }
              } else {
                validationError = true;
                $('#coglcode' + index).addClass('is-invalid');
                $('#errcoglcode' + index).text('It must be a number only.');
                $('#errcoglcode' + index).show();
              }
            }

            if (element.coifsc == '') {
              validationError = true;
              $('#coifsc' + index).addClass('is-invalid');
              $('#errcoifsc' + index).text('This field is required.');
              $('#errcoifsc' + index).show();
            }

            if (element.coaccount == '') {
              validationError = true;
              $('#coaccount' + index).addClass('is-invalid');
              $('#errcoaccount' + index).text('This field is required.');
              $('#errcoaccount' + index).show();
            } else {
              var pattern = /^\d+$/;
              if (pattern.test(element.coaccount)) {
              } else {
                validationError = true;
                $('#coaccount' + index).addClass('is-invalid');
                $('#errcoaccount' + index).text('It must be a number only.');
                $('#errcoaccount' + index).show();
              }
            }

            if (element.cophone == '') {
              validationError = true;
              $('#cophone' + index).addClass('is-invalid');
              $('#errcophone' + index).text('This field is required.');
              $('#errcophone' + index).show();
            } else {
              var pattern = /^\d+$/;
              if (pattern.test(element.cophone)) {
                if ((element.cophone).toString().length != 10) {
                  validationError = true;
                  $('#cophone' + index).addClass('is-invalid');
                  $('#errcophone' + index).text('The value must be 10 digit.');
                  $('#errcophone' + index).show();
                }
              } else {
                validationError = true;
                $('#cophone' + index).addClass('is-invalid');
                $('#errcophone' + index).text('It must be a number only.');
                $('#errcophone' + index).show();
              }
            }

            if (element.coaltphone != '') {
              var pattern = /^\d+$/;
              if (pattern.test(element.coaltphone)) {
                if ((element.coaltphone).toString().length != 10) {
                  validationError = true;
                  $('#coaltphone' + index).addClass('is-invalid');
                  $('#errcoaltphone' + index).text('The value must be 10 digit.');
                  $('#errcoaltphone' + index).show();
                }
              } else {
                validationError = true;
                $('#coaltphone' + index).addClass('is-invalid');
                $('#errcoaltphone' + index).text('It must be a number only.');
                $('#errcoaltphone' + index).show();
              }
            }

            if (element.copercent == '') {
              validationError = true;
              $('#copercent' + index).addClass('is-invalid');
              $('#errcopercent' + index).text('This field is required.');
              $('#errcopercent' + index).show();
            } else {
              var pattern = /^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?)$/;
              if (pattern.test(element.copercent)) {
              } else {
                validationError = true;
                $('#copercent' + index).addClass('is-invalid');
                $('#errcopercent' + index).text('Entered value isn\'t right.');
                $('#errcopercent' + index).show();
              }
            }
          });

          if (totalPercent < 100) {
            errorMsg += '&#10148; <u>Percentage Calculation</u> &#10171; The sum of the percentage of owner and co-owner is less than 100.<br>';
          } else if (totalPercent > 100) {
            errorMsg += '&#10148; <u>Percentage Calculation</u> &#10171; The sum of the percentage of owner and co-owner is greater than 100.<br>';
          }
        } else {
          errorMsg += '&#10148; Add a co-owner before submitting the form.<br>';
        }
      }

      if (errorMsg || validationError) {
        this.submitted = false;
        this.btnLoader = false;
        $('.formError').show();
        $("#errorMsg").html(errorMsg);
        return false;
      }

      let isco = false;
      if (this.myForm.value.isco == 1) {
        isco = true;
      }

      const ownerReqData = {
        ownerId: this.ownerId,
        name: this.myForm.value.name,
        glCode: this.myForm.value.glcode,
        ifsc: this.myForm.value.ifsc,
        accountNo: this.myForm.value.account,
        phone: this.myForm.value.phone,
        altPhone: this.myForm.value.altphone,
        propertyType: this.myForm.value.type,
        isPartner: isco,
        percentage: this.myForm.value.opercent
      }

      this.apiService.update('/api/lessor/update', ownerReqData).subscribe((response: any) => {
        if (response.status === 200) {
          let existingCoOwners = [];
          if (isco && (this.myForm.value.coowners).length) {

            // ADD OR UPDATE CO-OWNER
            (this.myForm.value.coowners).forEach(element => {
              if (element.coid) {
                // Update co-owner
                existingCoOwners.push(element.coid);

                const coownerReqData = {
                  _id: element.coid,
                  lessorId: this.ownerId,
                  name: element.coname,
                  glCode: element.coglcode,
                  percentage: element.copercent,
                  ifsc: element.coifsc,
                  accountNo: element.coaccount,
                  phone: element.cophone,
                  altPhone: element.coaltphone
                }

                this.apiService.update('/api/coowner/update', coownerReqData).subscribe((coresponse: any) => {
                  // No need to show error or success message here.
                });
              } else {
                // Add co-owner
                const coownerReqData = {
                  lessorId: this.ownerId,
                  name: element.coname,
                  glCode: element.coglcode,
                  percentage: element.copercent,
                  ifsc: element.coifsc,
                  accountNo: element.coaccount,
                  phone: element.cophone,
                  altPhone: element.coaltphone
                }

                this.apiService.post('/api/coowner/create', coownerReqData).subscribe((coresponse: any) => {
                  // No need to show error or success message here.
                });
              }
            });

            // DELETE CO-OWNER (Change status for delete)
            let coOwnerDifference = (this.coOwnersId).filter(x => existingCoOwners.indexOf(x) === -1);
            if (coOwnerDifference.length) {
              coOwnerDifference.forEach(element => {
                const coownerReqData = {
                  _id: element
                }

                this.apiService.update('/api/coowner/delete', coownerReqData).subscribe((coresponse: any) => {
                  // No need to show error or success message here.
                });
              });
            }
          }
          this.submitted = false;
          this.btnLoader = false;
          this.toast('success', 'Successfully updated!')

          if (this.myForm.value.type == 'commercial') {
            this.router.navigateByUrl('/owner/commercial');
          } else {
            this.router.navigateByUrl('/owner/residential');
          }
        } else {
          errorMsg += '&#10148; Something went wrong. Please try again later.<br>';
          this.submitted = false;
          this.btnLoader = false;
        }
      }, (errorResult) => {
        this.errorHandling(errorResult);
      });
    } else {
      this.btnLoader = false;
    }

  }

  isCoOwnerHandler(event) {
    $('.formError').hide();
    const val = event.target.value.toLowerCase();
    if (val == 1) {
      $('.showcoowner').show();
    } else {
      $('.showcoowner').hide();
    }
  }

  ownerPercentHandler(event) {
    $('.formError').hide();
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
