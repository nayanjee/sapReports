import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-owner-create',
  templateUrl: './owner-create.component.html',
  styleUrls: ['./owner-create.component.css']
})
export class OwnerCreateComponent implements OnInit {
  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Add New owner';
  subheading = 'Create or Add a Commercial or Residential Owner.';
  icon = 'pe-7s-user icon-gradient bg-premium-dark';

  myForm: FormGroup;
  type: string = '';
  ownerPercent = '';
  coOwnerNumber = '';
  submitted = false;
  btnLoader = false;
  selectedType: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: AppServicesService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.type = params.type;
    });
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login'); 
    
    this.createForm();

    if (this.type) {
      this.selectedType = this.type;
      this.myForm.controls['type'].setValue(this.type, {onlySelf: true});
      this.myForm.value.type = this.type;
    }
  }

  get f() { return this.myForm.controls; }

  createForm() {
    this.myForm = this.fb.group({
      name:       ['', [Validators.required]],
      glcode:     ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[0-9]*$/)]],
      ifsc:       ['', [Validators.required]],
      account:    ['', [Validators.required]],
      phone:      ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      altphone:   [''],
      type:       ['', [Validators.required]],
      isco:       ['', [Validators.required]],
      opercent:   ['100', [Validators.required, Validators.pattern(/^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?)$/)]],
      addestate:  true,
      coowners:   this.fb.array([]),
    });
  }

  coowners(): FormArray {
    return this.myForm.get("coowners") as FormArray
  }

  newCoOwner(): FormGroup {
    return this.fb.group({
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
            console.log('totalPercent--', totalPercent);

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
        name: this.myForm.value.name.toLowerCase(),
        glCode: this.myForm.value.glcode,
        ifsc: this.myForm.value.ifsc,
        accountNo: this.myForm.value.account,
        phone: this.myForm.value.phone,
        altPhone: this.myForm.value.altphone,
        propertyType: this.myForm.value.type,
        isPartner: isco,
        percentage: this.myForm.value.opercent
      }
      
      this.apiService.post('/api/lessor/create', ownerReqData).subscribe((response: any) => {
        if (response.status === 200) {
          if (isco && (this.myForm.value.coowners).length) {
            (this.myForm.value.coowners).forEach(element => {
              const coownerReqData = {
                lessorId: response.data._id,
                name: element.coname.toLowerCase(),
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
            });
          }
          this.submitted = false;
          this.btnLoader = false;

          if (this.myForm.value.addestate) {
            this.router.navigateByUrl('/asset/create?owner='+response.data._id+'&type='+this.myForm.value.type);
          } else {
            if (this.myForm.value.type == 'commercial') {
              this.router.navigateByUrl('/owner/commercial');
            } else {
              this.router.navigateByUrl('/owner/residential');
            }
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

      // this.myForm.value.opercent = 50;
      // $('#opercent').val('50');
      // $("#opercent").prop("disabled", false);

      // this.myForm.value.cono = 1;
      // $('#cono').val('1');
      // $("#cono").prop("disabled", false);

      // this.ownerPercent   = this.myForm.value.opercent;
      // this.coOwnerNumber  = this.myForm.value.cono;
    } else {
      $('.showcoowner').hide();

      // this.myForm.value.opercent = 100;
      // $('#opercent').val('100');
      // $("#opercent").prop("disabled", true);

      // this.myForm.value.cono = 0;
      // $('#cono').val('0');
      // $("#cono").prop("disabled", true);

      // this.ownerPercent   = this.myForm.value.opercent;
      // this.coOwnerNumber  = this.myForm.value.cono;
    }

    console.log(event.target.value);
  }

  /* ownerNumberHandler(event) {
    const isCoOwner = this.myForm.value.isco;
    if (isCoOwner === 'yes') {
      if (event.target.value > 0) {
        const val = parseInt(event.target.value) + 1;
        const calc = 100 / val;
        $('#opercent').val(calc);
        this.myForm.value.opercent = calc;

        $('#conoError').hide();
        $('#cono').removeClass('is-invalid');
      } else {
        this.myForm.value.cono = 0;

        $('#opercent').val(100);
        this.myForm.value.opercent = 100;

        $('#conoError').show();
        $('#cono').addClass('is-invalid');
      }
      this.ownerPercent   = this.myForm.value.opercent;
      this.coOwnerNumber  = this.myForm.value.cono;
    } else {
      this.myForm.value.cono = 0;
      $('#cono').val('0');
      $("#cono").prop("disabled", true);

      this.myForm.value.opercent = 100;
      $('#opercent').val('100');
      $("#opercent").prop("disabled", true);

      this.ownerPercent   = this.myForm.value.opercent;
      this.coOwnerNumber  = this.myForm.value.cono;
    }
  } */

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
