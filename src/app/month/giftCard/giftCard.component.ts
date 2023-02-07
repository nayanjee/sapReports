import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';

import * as XLSX from 'xlsx-js-style';
import * as moment from 'moment';

import { AppServicesService } from './../../shared/service/app-services.service';
import { ThrowStmt } from '@angular/compiler';

declare var $: any;

@Component({
  selector: 'app-giftCard',
  templateUrl: './giftCard.component.html',
  styleUrls: ['./giftCard.component.css']
})
export class GiftCardComponent implements OnInit {
  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Gift Card';
  subheading = 'Net Sale 4 Gift Card 9000 Plant Excluding (Ex-Stockist)';
  icon = 'pe-7s-user icon-gradient bg-premium-dark';

  ShowFilter = true;
  limitSelection = false;
  dropdownSettings: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: this.ShowFilter
  };

  myForm: FormGroup;
  submitted = false;
  btnLoader = false;

  types: any = [
    { id: 1, name: 'With Division' },
    { id: 2, name: 'Without Division' },
  ];
  years: any = [
    { id: 2022, name: 2022 },
    { id: 2021, name: 2021 },
    { id: 2020, name: 2020 },
    { id: 2019, name: 2019 },
    { id: 2018, name: 2018 },
    { id: 2017, name: 2017 },
  ];
  months: any = [
    { id: '01', name: '01 - Jan' },
    { id: '02', name: '02 - Feb' },
    { id: '03', name: '03 - Mar' },
    { id: '04', name: '04 - Apr' },
    { id: '05', name: '05 - May' },
    { id: '06', name: '06 - Jun' },
    { id: '07', name: '07 - Jul' },
    { id: '08', name: '08 - Aug' },
    { id: '09', name: '09 - Sep' },
    { id: '10', name: '10 - Oct' },
    { id: '11', name: '11 - Nov' },
    { id: '12', name: '12 - Dec' },
  ];
  salesData: any = [];
  finalData: any = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: AppServicesService
  ) {

  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laSapUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login');

    this.createForm();
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }

  get f() { return this.myForm.controls; }

  async onSubmit() {
    this.submitted = true;
    this.btnLoader = true;

    if (this.myForm.valid) {
      const dt = this.myForm.value.year[0].id + '-' + this.myForm.value.month[0].id + '-01';
      const monthyear = moment(dt);
      const typeId = this.myForm.value.type[0].id;

      this.salesData = await this.getSales(typeId, monthyear);
      // console.log('salesData---', this.salesData);

      await this.exportToExcel(typeId, this.myForm.value.month, this.myForm.value.year[0].id);
    }
  }

  getSales = (type, monthyear) => {
    return new Promise(resolve => {
      const reqData = {
        type: type,
        monthyear: monthyear
      }
      this.apiService.post('/api/giftSales', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  exportToExcel(typeId, month, year) {
    let type = 'WithoutDivision';
    if (typeId == 1) {
      type = 'WithDivision';
    }

    const m1 = (month[0].name).split(' - ');

    let fileName = 'GiftCard_' + m1[1] + '_' + year + '_' + type;
    console.log('filename--', fileName);

    let finalData = [];
    this.salesData.forEach(product => {
      if (typeId == 1) {
        const productData = {
          'Plant Code': product.plant,
          'Customer Code': product.billToParty,
          'Customer Name': product.billToPartyName,
          'Customer City': product.billPartyCity,
          'Division Code': product.division,
          'Division Name': product.divisionName,
          'Value': product.totalQty
        }
        finalData.push(productData);
      } else {
        const productData = {
          'Plant Code': product.plant,
          'Customer Code': product.billToParty,
          'Customer Name': product.billToPartyName,
          'Customer City': product.billPartyCity,
          'Value': product.totalQty
        }
        finalData.push(productData);
      }
    });
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData);
    // Set colum width
    ws['!cols'] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 }
    ];

    for (var i in ws) {
      // console.log(ws[i]);
      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
        alignment: {
          vertical: 'center',
          wrapText: 1
        }
      };

      if (cell.r == 0) {
        // first row
        ws[i].s.alignment = { vertical: "center", wrapText: true };
        ws[i].s.fill = { fgColor: { rgb: "585858" } };
        ws[i].s.font = { bold: true, color: { rgb: "FFFFFF" } };
        //ws[i].s.border.bottom = { style: 'thin', color: '000000' };
      }

      // if (cell.c == 6) {
      //   // first column
      //   ws[i].s.numFmt = 'DD-MM-YYYY'; // for dates
      //   ws[i].z = 'DD-MM-YYYY';
      // } else {
      //   ws[i].s.numFmt = '00'; // other numbers
      // }

      // if (cell.r % 2) {
      //   // every other row
      //   ws[i].s.fill = {
      //     // background color
      //     patternType: 'solid',
      //     fgColor: { rgb: 'b2b2b2' },
      //     bgColor: { rgb: 'b2b2b2' },
      //   };
      // }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName + '.xlsx');
  }

  createForm() {
    this.myForm = this.fb.group({
      type: ['', [Validators.required]],
      year: ['', [Validators.required]],
      month: ['', [Validators.required]]
    });
  }

  changeValue(e) {
    console.log(e);
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
