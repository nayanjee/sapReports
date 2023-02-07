import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-asset-create',
  templateUrl: './asset-create.component.html',
  styleUrls: ['./asset-create.component.css']
})
export class AssetCreateComponent implements OnInit {
  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Add New asset';
  subheading = 'Add a Commercial, Residential or Owned Asset.';
  icon = 'pe-7s-network icon-gradient bg-premium-dark';

  myForm: FormGroup;
  type: string = '';
  submitted = false;
  btnLoader = false;
  owners: any = [];
  states: any = [];
  cities: any = [];
  selectedOwner: any;
  selectedCity: any;
  selectedType: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: AppServicesService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type) this.selectedType = params.type;
      if (params.owner) this.selectedOwner = params.owner;
    });
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login');

    this.getStates();
    // this.getOwners();
    this.createForm();

    if (this.selectedType) {
      this.myForm.controls['type'].setValue(this.selectedType, {onlySelf: true});
      this.myForm.value.type = this.selectedType;
      this.getOwner(this.selectedType);
    }
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
      lcd:              ['', [Validators.required, Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\-](0?[1-9]|1[012])[\-]\d{4}$/)]],
      rcd:              ['', [Validators.required, Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\-](0?[1-9]|1[012])[\-]\d{4}$/)]],
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

  getOwner(val) {
    this.apiService.get('/api/lessor/property', val).subscribe((response: any) => {
      if (response.status === 200) {
        this.owners = response.data;
        if (this.selectedOwner) {
          this.myForm.controls['owner'].setValue(this.selectedOwner, {onlySelf: true});
          this.myForm.value.owner = this.selectedOwner;
        } else if (this.owners.length) {
          this.selectedOwner = this.owners[0]._id;
          this.myForm.controls['owner'].setValue(this.selectedOwner, {onlySelf: true});
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
        if (this.cities.length) {
          this.selectedCity = this.cities[0]._id;
          this.myForm.controls['city'].setValue(this.selectedCity, {onlySelf: true});
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
      }else{
        validationError = true;
        $('#lip').addClass('is-invalid');
        $('#errlip').text('It must be a number only.');
        $('#errlip').show();
      }
    }

    if (this.myForm.value.sda != '') {
      var pattern = /^\d+$/;
      if (pattern.test(this.myForm.value.sda)) {
        $('#sda').removeClass('is-invalid');
        $('#errsda').hide();
      }else{
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
      }else{
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
        propertyType:               this.myForm.value.type,
        ownerId:                    this.myForm.value.owner,
        allotee:                    this.myForm.value.allotee.toLowerCase(),
        flatNo:                     this.myForm.value.flatnumber,
        address:                    this.myForm.value.address,
        location:                   this.myForm.value.location,
        stateId:                    this.myForm.value.state,
        cityId:                     this.myForm.value.city,
        zipCode:                    this.myForm.value.zipcode,
        area:                       this.myForm.value.area,
        agreementPeriod:            this.myForm.value.agreementperiod,
        agreementType:              this.myForm.value.agreementtime,
        leaseCommencementDate:      leaseCommencementDate,
        rentCommencementDate:       rentCommencementDate,
        agreementExpiryDate:        agreementExpiryDate,
        LockInPeriod:               this.myForm.value.lip,
        rentEscalationDate:         this.myForm.value.rad,
        rentAmount:                 this.myForm.value.amount,
        increaseRentPercent:        this.myForm.value.increaseat,
        increaseRentPeriod:         this.myForm.value.increaseon,
        securityDepositAmount:      this.myForm.value.sda,
        securityDepositDescription: this.myForm.value.sdd,
        remarks:                    this.myForm.value.remarks,
        paymentDueDate:             this.myForm.value.pdd,
        paymentPattern:             this.myForm.value.pattern,
        previousRecord:             this.myForm.value.record
      }

      this.apiService.post('/api/asset/create', reqData).subscribe((response: any) => {
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
        } else {
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
