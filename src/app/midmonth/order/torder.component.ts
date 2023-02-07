import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';

import * as XLSX from 'xlsx-js-style';
import * as moment from 'moment';

import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-month-torder',
  templateUrl: './torder.component.html',
  styleUrls: ['./torder.component.css']
})
export class TorderComponent implements OnInit {
  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Last Month Sales, Stock & Order';
  subheading = 'Sales & Current Month 20 Days Stock (Current Month Sales + Current Month Closing Stock & Calculation BCM - SMA).';
  icon = 'pe-7s-user icon-gradient bg-premium-dark';

  ShowFilter = true;
  limitSelection = false;
  dropdownSetting: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: false
  };
  dropdownSettingsPlant: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: this.ShowFilter
  };
  dropdownSettingsDivision: any = {
    singleSelection: true,
    idField: 'division',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: this.ShowFilter
  };

  myForm: FormGroup;
  submitted = false;
  btnLoader = false;

  plants: any = [];
  divisions: any = [];
  toMonths: any = [];
  fromMonths: any = [];
  toYears: any = [];
  fromYears: any = [];
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
  ptypes: any = [
    {id: 1, name: 'Price With Tax'},
    {id: 2, name: 'Price Without Tax'}
  ];

  salesData: any = [];
  stockData: any = [];
  finalData: any = [];
  productData: any = [];
  productShelflife: any = [];
  productMultiplier: any = [];
  productPrice: any = [];
  productPriceWithoutTax: any = [];

  selectedDistributor: string = '';
  selectedDistributorName: string = '';
  selectedDivision: any = [];
  selectedDivisionDetails: any = [];
  selectedDate: any = [];
  defaultMultiplier: string = '1.5';

  // selectedDistributor: string = '9011';
  // selectedDivision: any = ['02', '06'];
  // selectedDivisionDetails: any = [{ id: '02', name: 'Lauctus-ALFA' }, { id: '06', name: 'Laviator' }];
  // selectedDate: any = ['2022-06-01T00:00:00.000Z', '2022-07-01T00:00:00.000Z'];


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: AppServicesService
  ) {
    this.getPlants();
    this.getDivisions();
  }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('laSapUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login');

    this.createForm();

    const currentMonth = 8;
    //const currentMonth = parseInt(moment().format('MM'));
    const currentYear = parseInt(moment().format('YYYY'));
    const previousYear = currentYear - 1;
    this.fromYears = [previousYear, currentYear];
    this.toYears = [previousYear, currentYear];

    /* if (currentMonth < 2) {
      const previousYear = currentYear - 1;
      this.fromYears = [previousYear];
      this.toYears = [previousYear];
    } else if (currentMonth < 6) {
      const previousYear = currentYear - 1;
      this.fromYears = [previousYear, currentYear];
      this.toYears = [currentYear];

      const currentYearObj = {id: currentYear.toString(), name: currentYear}
      this.myForm.controls['toYear'].setValue([currentYearObj], { onlySelf: true });
      this.myForm.value.toYear = [currentYearObj];
    } else {
      this.fromYears = [currentYear];
    } */

    // Year dropdown value
    /* for (var i = 2016; i <= currentYear; i++) {
      const tempYear = { id: i.toString(), name: i };
      this.toYears.push(tempYear);
      this.fromYears.push(tempYear);
    }

    const currentYearObj = {id: currentYear.toString(), name: currentYear}
    this.onFromYearSelect(currentYearObj);
    this.onToYearSelect(currentYearObj);

    this.myForm.controls['fromYear'].setValue([currentYearObj], { onlySelf: true });
    this.myForm.value.fromYear = [currentYearObj];

    this.myForm.controls['toYear'].setValue([currentYearObj], { onlySelf: true });
    this.myForm.value.toYear = [currentYearObj]; */
  }

  onFromYearSelect(item: any) {
    /* this.fromMonths = [];
    const currentMonth = parseInt(moment().format('MM'));
    const currentYear = parseInt(moment().format('YYYY'));
    
    if (item.name === currentYear) {
      const monthLoop = (currentMonth <= 1) ? 13 : currentMonth;
      for (var m = 1; m < monthLoop; m++) {
        const date = new Date();
              date.setMonth(m - 1);
        const mo = date.toLocaleString([], { month: 'long' });
        const moId = (m < 10) ? '0' + m : m;
        this.fromMonths.push({ id: moId, name: moId + ' - ' + mo });
      }
    } else {
      this.fromMonths = this.months;
    } */
  }

  onToYearSelect(item: any) {
    /* this.toMonths = [];
    const currentMonth = parseInt(moment().format('MM'));
    const currentYear = (currentMonth <= 1) ? parseInt(moment().format('YYYY')) - 1 : parseInt(moment().format('YYYY'));
    
    if (item.name === currentYear) {
      const monthLoop = (currentMonth <= 1) ? 13 : currentMonth;
      for (var m = 1; m < monthLoop; m++) {
        const date = new Date();
              date.setMonth(m - 1);
        const mo = date.toLocaleString([], { month: 'long' });
        const moId = (m < 10) ? '0' + m : m;
        this.toMonths.push({ id: moId, name: moId + ' - ' + mo });
      }
    } else {
      this.toMonths = this.months;
    } */
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }
  // toogleShowFilter() {
  //   this.ShowFilter = !this.ShowFilter;
  //   this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  // }

  // handleLimitSelection() {
  //   if (this.limitSelection) {
  //     this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
  //   } else {
  //     this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
  //   }
  // }

  get f() { return this.myForm.controls; }

  getPlants() {
    this.apiService.get('/api/distributorDropdown', '').subscribe((response: any) => {
      if (response.status === 200) {
        this.plants = response.data;
      }
    });
  }

  getDivisions() {
    this.apiService.get('/api/divisionDropdown', '').subscribe((response: any) => {
      if (response.status === 200) {
        this.divisions = response.data;
      }
    });
  }

  async onSubmit() {
    this.selectedDate = [];
    this.selectedDivision = [];
    this.selectedDivisionDetails = [];
    this.selectedDistributor = '';
    this.selectedDistributorName = '';

    let validationError = false;
    this.submitted = true;
    //this.btnLoader = true;

    if (this.myForm.valid) {
      // Set selected Distributor/Plant
      this.selectedDistributor = this.myForm.value.plant[0].id;
      const distributorName = (this.myForm.value.plant[0].name).split(' - ');
      this.selectedDistributorName = distributorName[1];

      (this.myForm.value.division).forEach(element => {
        const tempDivision = { id: element.division, name: element.divisionName };
        this.selectedDivisionDetails.push(tempDivision);
        this.selectedDivision.push(element.division);
      });

      $('#errtoyear').hide();
      $('#errtomonth').hide();

      if (this.myForm.value.toMonth.length > 0 && this.myForm.value.toYear.length <= 0) {
        validationError = true;
        $('#errtoyear').text('Field is required.');
        $('#errtoyear').show();
      }

      if (this.myForm.value.toMonth.length <= 0 && this.myForm.value.toYear.length > 0) {
        validationError = true;
        $('#errtomonth').text('Field is required.');
        $('#errtomonth').show();
      }

      if (this.myForm.value.toMonth.length > 0 && this.myForm.value.toYear.length > 0) {
        console.log('both entered')
      }

      let dateEnd: any;
      const fromDate = this.myForm.value.fromYear[0] + '-' + this.myForm.value.fromMonth[0].id + '-01';
      const dateStart = moment(fromDate);

      if (this.myForm.value.toMonth.length > 0 && this.myForm.value.toYear.length > 0) {
        const toDate = this.myForm.value.toYear[0] + '-' + this.myForm.value.toMonth[0].id + '-28';
        dateEnd = moment(toDate);

        const dayDiff = moment.duration(dateEnd.diff(dateStart)).asDays();
        console.log('both entered', dayDiff);
        if (dayDiff < 0) {
          validationError = true;
          $('#errtomonth').text('it must be greater than the date above.');
          $('#errtomonth').show();
        }

        if (dayDiff > 155) {
          validationError = true;
          $('#errtomonth').text('Select maximum 5 months.');
          $('#errtoyear').text('Select maximum 5 months.');
          $('#errtoyear').show();
          $('#errtomonth').show();
        }

        console.log('dateStart---', dateStart);
        console.log('dateEnd----', dateEnd);
        while (dateEnd > dateStart) {
          this.selectedDate.push(dateStart.format('YYYY-MM-01[T]00:00:00.000[Z]'));
          dateStart.add(1, 'month');
        }
      } else {
        this.selectedDate.push(dateStart.format('YYYY-MM-01[T]00:00:00.000[Z]'));
      }

      if (!validationError) {
        let endDate = '';
        if (this.selectedDate.length >= 2) {
          endDate = moment(this.selectedDate[parseInt(this.selectedDate.length) - 1], 'YYYY-MM-DD[T]00:00:00.000[Z]').format('YYYY-MM-01');
        } else {
          endDate = moment(this.selectedDate[0], 'YYYY-MM-DD[T]00:00:00.000[Z]').format('YYYY-MM-01');
        }
        console.log('No Error');
        console.log('form---', this.myForm.value);

        this.salesData = await this.getSales();
        //console.log('salesData---', this.salesData);

        if (this.salesData.length > 0) {
          this.stockData = await this.getStocks(endDate);
          //console.log('stockData---', this.stockData);
        
          this.productData = await this.getProducts();
          //console.log('productData---', this.productData);

          this.finalData = await this.generateData();
          //console.log('gdata---', this.finalData);

          await this.exportToExcel(this.myForm.value['multiplier'], this.myForm.value['priceType'][0].id);
        }
      } else {
        console.log('Error')
      }
    } 
  }

  getSales = () => {
    return new Promise(resolve => {
      console.log('selectedDistributor---', this.selectedDistributor);
      console.log('selectedDivision---', this.selectedDivision);
      console.log('selectedDate---', this.selectedDate);

      const reqData = {
        plant: this.selectedDistributor,
        division: this.selectedDivision,
        dateRange: this.selectedDate
      }
      this.apiService.post('/api/sales', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          console.log('api response---', response.data);
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  getStocks = (date) => {
    return new Promise(resolve => {
      const data = [];
      const reqData = {
        plant: this.selectedDistributor,
        division: this.selectedDivision,
        monthYear: date
      }
      this.apiService.post('/api/stocks', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          resolve(data);
        }
      });
    });
  }

  getProducts = () => {
    return new Promise(async resolve => {
      const reqData = {
        divisions: this.selectedDivision
      }
      this.apiService.post('/api/product/byDivision', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  generateData = () => {
    return new Promise(async resolve => {
      let finalData = [];
      
      this.productData.forEach(product => {
        const productData = {
          'Distributor': this.selectedDistributorName,
          'Division': '',
          'Material Code': product.material,
          'Product': product.name
        }

        // Break down month wise data
        this.selectedDate.forEach((date, index) => {
          productData[moment(date).format("MMM YYYY")] = 0;

          // Collect data by matching division, material code and date
          const filteredData = this.salesData.filter(sales =>
            sales.division == product.division &&
            sales.material == product.material &&
            sales.monthYear == date
          );


          // Fill value for the division and particular month.
          if (filteredData && filteredData.length) {
            productData['Division'] = filteredData[0].divisionName;
            productData[moment(date).format("MMM YYYY")] = filteredData[0].totalQty;
          }

          if (this.selectedDate.length === parseInt(index) + 1) {
            const filteredData2 = this.stockData.filter(stock =>
              stock.division == product.division && 
              stock.material == product.material
            );

            if (filteredData2 && filteredData2.length) {
              productData['Division'] = filteredData2[0].divisionName;
              productData['Closing Stock'] = filteredData2[0].totalQty;
              productData['Closing Stock Value'] = filteredData2[0].totalValue;
            } else {
              productData['Closing Stock'] = 0;
              productData['Closing Stock Value'] = 0;
            }
          }
        });

        finalData.push(productData);
      });
      await resolve(finalData);
    });
  }

  async exportToExcel(multiplier, priceType) {
    let fileName = 'MonthlySalesLastStock_' + this.selectedDistributor;
    // console.log('finalData111---', this.finalData);

    // add division in filename
    this.selectedDivision.forEach(division => {
      fileName = fileName + '_' + division;
    });

    // Convert from selected date to visible date
    let months = [];
    this.selectedDate.forEach((date, index) => {
      const month = moment(date).format("MMM YYYY");
      months.push(month);

      const startDate = moment(date, 'YYYY-MM-DD[T]00:00:00.000[Z]').format('MM-YYYY');
      
      // only fromDate and lastDate should be mentioned in filename
      if (index == 0 || index == this.selectedDate.length-1) {
        fileName = fileName + '_' + startDate;
      }
      console.log(index, this.selectedDate.length);
    });
    
    // Deleting that record from finalData when sales quantity is zero
    if (months.length == 1) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 2) {
      //this.finalData = this.finalData.filter(sales => sales[months[0]] != 0 || sales[months[1]] != 0);
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 ||
        sales[months[1]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 3) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 ||
        sales[months[2]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 4) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 ||
        sales[months[3]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 5) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 6) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 7) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 ||
        sales[months[6]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 8) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 ||
        sales[months[7]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 9) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 10) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales[months[9]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 11) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales[months[9]] != 0 ||
        sales[months[10]] != 0 || sales['Closing Stock'] != 0
      );
    } else if (months.length == 12) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales[months[9]] != 0 || sales[months[10]] != 0 ||
        sales[months[11]] != 0 || sales['Closing Stock'] != 0
      );
    }

    // Sort finalData by Product Name
    this.finalData = this.finalData.sort((a, b) => a['Product'].localeCompare(b['Product']));

    // Sort finalData by division
    this.finalData = this.finalData.sort((a, b) => a['Division'].localeCompare(b['Division']));

    // Gathering finalData materialCode in an array
    const materials = [];
    this.finalData.forEach(fd => {
      materials.push(fd['Material Code']);
    });

    if (priceType == 2) {
      console.log('Without Tax');
      // Get product price without tax
      this.productPrice = await this.getProductPriceWithoutTax(materials);
    } else {
      console.log('With Tax');
      // Get product price with tax
      this.productPrice = await this.getProductPriceWithTax(materials);
    }
    

    // Get product multiplier
    this.productMultiplier = await this.getProductMultiplier(materials);

    // Get product shelfLife
    this.productShelflife = await this.getProductShelflife(materials);

    var bar = new Promise((resolve, reject) => {
      let total_bml_carton = 0;
      let total_bmi_qty = 0;
      let total_bmi_val = 0;
      let total_sma_carton = 0;
      let total_sma_qty = 0;
      let total_sma_val = 0;

      this.finalData.forEach(async (value, index, array) => {
        let average = 0;
        months.forEach((m) => {
          average = average + value[m];
        });
        this.finalData[index]['AVG Sale'] = Math.round(average / months.length);

        // Match material code between finalData and productPrice.
        const filteredData = this.productPrice.filter(final =>
          final.material == value['Material Code']
        );

        if (filteredData && filteredData.length) {
          this.finalData[index]['Rate'] = parseFloat(filteredData[0][this.selectedDistributor]);
          this.finalData[index]['Pack Size'] = filteredData[0]['packageSize'];
        } else {
          this.finalData[index]['Rate'] = 0;
          this.finalData[index]['Pack Size'] = 0;
        }

        // Match material code between finalData and productMultiplier.
        const filteredData2 = this.productMultiplier.filter(final =>
          final.material == value['Material Code']
        );

        if (filteredData2 && filteredData2.length) {
          this.finalData[index]['Multiplier'] = parseFloat(filteredData2[0]['multiplier']);
        } else {
          this.finalData[index]['Multiplier'] = parseFloat(multiplier);
        }

        // Match material code between finalData and productMultiplier.
        const filteredData3 = this.productShelflife.filter(final =>
          final.material == value['Material Code']
        );

        if (filteredData3 && filteredData3.length) {
          this.finalData[index]['Shelf Life'] = parseFloat(filteredData3[0]['shelfLife']);
        } else {
          this.finalData[index]['Shelf Life'] = '';
        }

        // BLM (Based on last month) Carton
        const lastMonthSales = value[months[months.length - 1]];
        const blmCarton = Math.round(((lastMonthSales * value['Multiplier']) - value['Closing Stock']) / value['Pack Size']);
        if (blmCarton > 0) {
          const bmi_qty = blmCarton * value['Pack Size'];
          const bmi_val = bmi_qty * value['Rate'];

          total_bml_carton = total_bml_carton + blmCarton;
          total_bmi_qty = total_bmi_qty + bmi_qty;
          total_bmi_val = total_bmi_val + bmi_val;

          this.finalData[index]['BLM_Carton'] = blmCarton;
          this.finalData[index]['BLM_AVG Qty'] = bmi_qty;
          this.finalData[index]['BLM_AVG Val'] = bmi_val;
        } else {
          this.finalData[index]['BLM_Carton'] = 0;
          this.finalData[index]['BLM_AVG Qty'] = 0;
          this.finalData[index]['BLM_AVG Val'] = 0;
        }
        
        // SMA (Selected Months Average) Carton
        const smaCarton = Math.round(((value['AVG Sale'] * value['Multiplier']) - value['Closing Stock']) / value['Pack Size']);
        if (smaCarton > 0) {
          const sma_qty = smaCarton * value['Pack Size'];
          const sma_val = sma_qty * value['Rate'];

          total_sma_carton = total_sma_carton + smaCarton;
          total_sma_qty = total_sma_qty + sma_qty;
          total_sma_val = total_sma_val + sma_val;

          this.finalData[index]['SMA_Carton'] = smaCarton;
          this.finalData[index]['SMA_AVG Qty'] = sma_qty;
          this.finalData[index]['SMA_AVG Val'] = sma_val;
        } else {
          this.finalData[index]['SMA_Carton'] = 0;
          this.finalData[index]['SMA_AVG Qty'] = 0;
          this.finalData[index]['SMA_AVG Val'] = 0;
        }

        if (index === array.length -1) resolve(0);
      });

      // To create last row of the excel sheet
      const lastRow = {
        'Distributor': '',
        'Division': '',
        'Material Code': '',
        'Product': ''
      }
      months.forEach(elem => {
        lastRow[elem] = '';
      });
      lastRow['Closing Stock'] = '';
      lastRow['Closing Stock Value'] = '';
      lastRow['AVG Sale'] = '';
      lastRow['Rate'] = '';
      lastRow['Pack Size'] = '';
      lastRow['Multiplier'] = '';
      lastRow['Shelf Life'] = 'TOTAL';
      lastRow['BLM_Carton'] = total_bml_carton;
      lastRow['BLM_AVG Qty'] = total_bmi_qty;
      lastRow['BLM_AVG Val'] = total_bmi_val;
      lastRow['SMA_Carton'] = total_sma_carton;
      lastRow['SMA_AVG Qty'] = total_sma_qty;
      lastRow['SMA_AVG Val'] = total_sma_val;
      
      this.finalData.push(lastRow);
    });
    bar.then(() => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.finalData);

      // Set colum width
      ws['!cols'] = [
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
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
    });
  }

  getProductPriceWithTax(ids) {
    return new Promise(resolve => {
      const reqData = { 
        materials: ids 
      }

      this.apiService.post('/api/ppwt', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  getProductPriceWithoutTax(ids) {
    return new Promise(resolve => {
      const reqData = { 
        materials: ids 
      }

      this.apiService.post('/api/ppwot', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  getProductMultiplier(ids) {
    return new Promise(resolve => {
      const reqData = { 
        materials: ids 
      }

      this.apiService.post('/api/multipliers', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  getProductShelflife(ids) {
    return new Promise(resolve => {
      const reqData = { 
        materials: ids 
      }

      this.apiService.post('/api/shelflifes', reqData).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  createForm() {
    this.myForm = this.fb.group({
      plant: ['', [Validators.required]],
      division: ['', [Validators.required]],
      priceType: ['', [Validators.required]],
      multiplier: ['', [Validators.required, Validators.pattern(/^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?)$/)]],
      fromMonth: ['', [Validators.required]],
      fromYear: ['', [Validators.required]],
      toMonth: [''],
      toYear: [''],
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

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
}
