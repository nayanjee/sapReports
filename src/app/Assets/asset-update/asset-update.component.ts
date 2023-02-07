import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-asset-update',
  templateUrl: './asset-update.component.html',
  styleUrls: ['./asset-update.component.css']
})
export class AssetUpdateComponent implements OnInit {
  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Update asset';
  subheading = 'Update a Commercial, Residential or Owned Asset.';
  icon = 'pe-7s-network icon-gradient bg-premium-dark';

  myForm: FormGroup;
  submitted = false;
  btnLoader = false;
  owners: any = [];
  states: any = [];
  cities: any = [];
  selectedCity: any;
  selectedType: any;
  selectedOwner: any;
  assetId: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: AppServicesService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.aid) this.assetId = params.aid;
    });
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login');

    this.getStates();
    this.createForm();
    this.getAsset();
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
      type:             ['', [Validators.required]],
      owner:            ['', [Validators.required]],
      allotee:          ['', [Validators.required]],
      flatnumber:       ['', [Validators.required]],
      address:          ['', [Validators.required]],
      location:         ['', [Validators.required]],
      state:            ['', [Validators.required]],
      city:             ['', [Validators.required]],
      zipcode:          ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[0-9]*$/)]],
      area:             [''],
      agreementperiod:  ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      agreementtime:    ['', [Validators.required]],
      lcd:              ['', [Validators.required]],
      rcd:              ['', [Validators.required]],
      red:              ['', [Validators.required, Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\-](0?[1-9]|1[012])[\-]\d{4}$/)]],
      lip:              [''],
      rad:              [''],
      amount:           ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      increaseat:       ['10', [Validators.required, Validators.pattern(/^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?)$/)]],
      increaseon:       ['1', [Validators.required, Validators.pattern(/^[1-9][0-9]?$|^99$/)]],
      sda:              [''],
      sdd:              [''],
      remarks:          [''],
      pdd:              ['5', [Validators.required]],
      pattern:          [''],
      record:           ['']
    });
  }

  changePropertyType(event) {
    const val = event.target.value.toLowerCase();
    this.getOwner(val);
  }

  changeState(event) {
    const val = event.target.value;
    if (val != '') {
      this.getCitiesById(val);
    } else {
      this.cities = [];
    }
  }

  getAsset() {
    if (this.assetId) {
      this.apiService.get('/api/asset', this.assetId).subscribe((response: any) => {
        console.log(response);
        if (response.status === 200) {
          this.myForm.controls['type'].setValue(response.data.propertyType, { onlySelf: true });
          this.myForm.value.type = response.data.propertyType;

          this.selectedOwner = response.data.ownerId;

          this.myForm.controls['allotee'].setValue(response.data.allotee, { onlySelf: true });
          this.myForm.value.allotee = response.data.allotee;

          this.myForm.controls['flatnumber'].setValue(response.data.flatNo, { onlySelf: true });
          this.myForm.value.flatnumber = response.data.flatNo;

          this.myForm.controls['address'].setValue(response.data.address, { onlySelf: true });
          this.myForm.value.address = response.data.address;

          this.myForm.controls['location'].setValue(response.data.location, { onlySelf: true });
          this.myForm.value.location = response.data.location;

          this.myForm.controls['state'].setValue(response.data.stateId, { onlySelf: true });
          this.myForm.value.state = response.data.stateId;

          this.selectedCity = response.data.cityId;

          this.myForm.controls['zipcode'].setValue(response.data.zipCode, { onlySelf: true });
          this.myForm.value.zipcode = response.data.zipCode;

          this.myForm.controls['area'].setValue(response.data.area, { onlySelf: true });
          this.myForm.value.area = response.data.area;

          this.myForm.controls['agreementperiod'].setValue(response.data.agreementPeriod, { onlySelf: true });
          this.myForm.value.agreementperiod = response.data.agreementPeriod;

          this.myForm.controls['agreementtime'].setValue(response.data.agreementType, { onlySelf: true });
          this.myForm.value.agreementtime = response.data.agreementType;

          this.myForm.controls['lcd'].setValue(moment(response.data.leaseCommencementDate).format('DD-MM-YYYY'), { onlySelf: true });
          this.myForm.value.lcd = moment(response.data.leaseCommencementDate).format('DD-MM-YYYY');

          this.myForm.controls['rcd'].setValue(moment(response.data.rentCommencementDate).format('DD-MM-YYYY'), { onlySelf: true });
          this.myForm.value.rcd = moment(response.data.rentCommencementDate).format('DD-MM-YYYY');

          this.myForm.controls['red'].setValue(moment(response.data.agreementExpiryDate).format('DD-MM-YYYY'), { onlySelf: true });
          this.myForm.value.red = moment(response.data.agreementExpiryDate).format('DD-MM-YYYY');

          this.myForm.controls['lip'].setValue(response.data.LockInPeriod, { onlySelf: true });
          this.myForm.value.lip = response.data.LockInPeriod;

          this.myForm.controls['rad'].setValue(response.data.rentEscalationDate, { onlySelf: true });
          this.myForm.value.rad = response.data.rentEscalationDate;

          this.myForm.controls['amount'].setValue(response.data.rentAmount, { onlySelf: true });
          this.myForm.value.amount = response.data.rentAmount;

          this.myForm.controls['increaseat'].setValue(response.data.increaseRentPercent, { onlySelf: true });
          this.myForm.value.increaseat = response.data.increaseRentPercent;

          this.myForm.controls['increaseon'].setValue(response.data.increaseRentPeriod, { onlySelf: true });
          this.myForm.value.increaseon = response.data.increaseRentPeriod;

          this.myForm.controls['sda'].setValue(response.data.securityDepositAmount, { onlySelf: true });
          this.myForm.value.sda = response.data.securityDepositAmount;

          this.myForm.controls['sdd'].setValue(response.data.securityDepositDescription, { onlySelf: true });
          this.myForm.value.sdd = response.data.securityDepositDescription;

          this.myForm.controls['remarks'].setValue(response.data.remarks, { onlySelf: true });
          this.myForm.value.remarks = response.data.remarks;

          this.myForm.controls['pdd'].setValue(response.data.paymentDueDate, { onlySelf: true });
          this.myForm.value.pdd = response.data.paymentDueDate;

          this.myForm.controls['pattern'].setValue(response.data.paymentPattern, { onlySelf: true });
          this.myForm.value.pattern = response.data.paymentPattern;

          this.myForm.controls['record'].setValue(response.data.previousRecord, { onlySelf: true });
          this.myForm.value.record = response.data.previousRecord;

          this.getOwner(response.data.propertyType);
          this.getCitiesById(response.data.stateId);
        }
      });
    } else {
      this.router.navigateByUrl('/dashboard');
      this.toast('success', 'Something went wrong try again to update asset!');
    }
  }

  getOwner(val) {
    this.apiService.get('/api/lessor/property', val).subscribe((response: any) => {
      if (response.status === 200) {
        this.owners = response.data;
        if (this.selectedOwner) {
          this.myForm.controls['owner'].setValue(this.selectedOwner, { onlySelf: true });
          this.myForm.value.owner = this.selectedOwner;
        } else if (this.owners.length) {
          this.selectedOwner = this.owners[0]._id;
          this.myForm.controls['owner'].setValue(this.selectedOwner, { onlySelf: true });
          this.myForm.value.owner = this.selectedOwner;
        }
      }
    });
  }

  getStates() {
    this.apiService.fetch('/api/state').subscribe((response: any) => {
      if (response.status === 200) {
        this.states = response.data;
      }
    });
  }

  getCitiesById(stateId) {
    this.apiService.get('/api/cities', stateId).subscribe((response: any) => {
      if (response.status === 200) {
        this.cities = response.data;
        if (this.selectedCity) {
          this.myForm.controls['city'].setValue(this.selectedCity, { onlySelf: true });
          this.myForm.value.city = this.selectedCity;
        } else if (this.cities.length) {
          this.selectedCity = this.cities[0]._id;
          this.myForm.controls['city'].setValue(this.selectedCity, { onlySelf: true });
          this.myForm.value.city = this.selectedCity;
        }
      }
    });
  }

  leaseHandler(event) {
    const val = event.target.value.toLowerCase();
    const agreementTime = $('#agreementtime').val();
    var splitDate = val.split("/");
    var dateOne = new Date(2007, 1, 1);  // YYYY, MM, DD
    var dateTwo = new Date(splitDate[2], splitDate[1], splitDate[0]);

    if (dateOne > dateTwo) {
      $('#errLcd').show();
      $('#lcd').addClass('is-invalid');
    } else {
      $('#errLcd').hide();
      $('#lcd').removeClass('is-invalid');
      this.myForm.value.rcd = val;
      $('#rcd').val(val)
    }
  }

  onSubmit() { 
    this.submitted = true;
    this.btnLoader = true;
    let validationError = false;

    if (this.myForm.value.lip != '') {
      var pattern = /^\d+$/;
      if (pattern.test(this.myForm.value.lip)) {
        $('#lip').removeClass('is-invalid');
        $('#errlip').hide();
      } else {
        validationError = true;
        $('#lip').addClass('is-invalid');
        $('#errlip').text('It must be a number only.');
        $('#errlip').show();
      }
    }
    
    if (this.myForm.value.sda) {
      var pattern = /^\d+$/;
      if (pattern.test(this.myForm.value.sda)) {
        $('#sda').removeClass('is-invalid');
        $('#errsda').hide();
      } else {
        validationError = true;
        $('#sda').addClass('is-invalid');
        $('#errsda').text('It must be a number only.');
        $('#errsda').show();
      }
    }

    if (this.myForm.value.pdd != '') {
      var pattern = /^\d+$/;
      if (pattern.test(this.myForm.value.pdd)) {
        if (this.myForm.value.pdd < 1 || this.myForm.value.pdd > 30) {
          validationError = true;
          $('#pdd').addClass('is-invalid');
          $('#errpdd').text('It must be any number between 1 and 30.');
          $('#errpdd').show();
        } else {
          $('#pdd').removeClass('is-invalid');
          $('#errpdd').hide();
        }
      } else {
        validationError = true;
        $('#pdd').addClass('is-invalid');
        $('#errpdd').text('It must be any number between 1 and 30.');
        $('#errpdd').show();
      }
    }

    if (this.myForm.valid && !validationError) {
      const lcd = (this.myForm.value.lcd).split('-').reverse().join('-');;
      const leaseCommencementDate = moment(lcd).format('YYYY-MM-DD[T]00:00:00.000[Z]');

      const rcd = (this.myForm.value.rcd).split('-').reverse().join('-');;
      const rentCommencementDate = moment(rcd).format('YYYY-MM-DD[T]00:00:00.000[Z]');

      const red = (this.myForm.value.red).split('-').reverse().join('-');;
      const agreementExpiryDate = moment(red).format('YYYY-MM-DD[T]00:00:00.000[Z]');
      
      const reqData = {
        assetId: this.assetId,
        propertyType: this.myForm.value.type,
        ownerId: this.myForm.value.owner,
        allotee: this.myForm.value.allotee,
        flatNo: this.myForm.value.flatnumber,
        address: this.myForm.value.address,
        location: this.myForm.value.location,
        stateId: this.myForm.value.state,
        cityId: this.myForm.value.city,
        zipCode: this.myForm.value.zipcode,
        area: this.myForm.value.area,
        agreementPeriod: this.myForm.value.agreementperiod,
        agreementType: this.myForm.value.agreementtime,
        leaseCommencementDate: leaseCommencementDate,
        rentCommencementDate: rentCommencementDate,
        agreementExpiryDate: agreementExpiryDate,
        LockInPeriod: this.myForm.value.lip,
        rentEscalationDate: this.myForm.value.rad,
        rentAmount: this.myForm.value.amount,
        increaseRentPercent: this.myForm.value.increaseat,
        increaseRentPeriod: this.myForm.value.increaseon,
        securityDepositAmount: this.myForm.value.sda,
        securityDepositDescription: this.myForm.value.sdd,
        remarks: this.myForm.value.remarks,
        paymentDueDate: this.myForm.value.pdd,
        paymentPattern: this.myForm.value.pattern,
        previousRecord: this.myForm.value.record
      }
      
      this.apiService.update('/api/asset/update', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          this.submitted = false;
          this.btnLoader = false;

          if (this.myForm.value.type == 'commercial') {
            this.router.navigateByUrl('/asset/commercial');
          } else if (this.myForm.value.type == 'residential') {
            this.router.navigateByUrl('/asset/residential');
          } else {
            this.router.navigateByUrl('/asset/owned');
          }
          this.toast('success', 'Updated Successfully!');
        } else {
          this.submitted = false;
          this.btnLoader = false;
        }
      }, (errorResult) => {
        this.errorHandling(errorResult);
      });
    } else {
      this.btnLoader = false;
      this.toast('info', 'Fill all the mandatory fields of the form or make any modification.');
    }
  }


  errorHandling(error: any) {
    try {
      // this.isLoading = false;
      const errorObj = error ? JSON.parse(error) : '';
      this.toast('error', errorObj.message);
    } catch (error) {
      this.toast('error', error);
    }
  }
}
