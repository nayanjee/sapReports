import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';

import * as XLSX from 'xlsx-js-style';
import * as moment from 'moment';

import { AppServicesService } from './../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-nayan',
  templateUrl: './nayan.component.html',
  styleUrls: ['./nayan.component.css']
})
export class NayanComponent implements OnInit {
  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Sales & Stock';
  subheading = 'Sales & Last Month Closing (Sale Quantity & Close Quantity + Close Value) => Excluding ZCRF Bill Document Type.';
  icon = 'pe-7s-user icon-gradient bg-premium-dark';

  myForm: FormGroup;
  type: string = '';
  ownerPercent = '';
  coOwnerNumber = '';
  submitted = false;
  btnLoader = false;
  selectedType: string = '';

  salesData: any;
  stockData: any;
  finalData: any = [];
  selectedDistributor: string = '9011';
  selectedDivision: any = ['2', '6'];
  selectedDivisionDetails: any = [{ id: 2, name: 'Lauctus-ALFA' }, { id: 6, name: 'Laviator' }];
  selectedDate: any = ['2022-06-01T00:00:00.000Z', '2022-07-01T00:00:00.000Z']

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
    this.loggedUserId = localStorage.getItem('laSapUserId');
    if (this.loggedUserId == 'null') this.router.navigateByUrl('/login');

    this.createForm();

    if (this.type) {
      this.selectedType = this.type;
      this.myForm.controls['type'].setValue(this.type, { onlySelf: true });
      this.myForm.value.type = this.type;
    }

    this.getSales();
  }

  get f() { return this.myForm.controls; }



  ExportTOExcel() {
    let fileName = 'Monthly-PlantSales-lastStock-' + this.selectedDistributor;
    // Convert from selected date to visible date
    let months = [];
    this.selectedDate.forEach(date => {
      const month = moment(date).format("MMM YYYY");
      fileName = fileName + '_' + moment(date).format("MMMYYYY");
      months.push(month);
    });

    // Deleting that record from finalData when sales quantity is zero
    if (months.length == 1) {
      this.finalData = this.finalData.filter(sales => 
        sales[months[0]] != 0 || sales['Closing Stock\n' + months[0]] != 0
      );
    } else if (months.length == 2) {
      //this.finalData = this.finalData.filter(sales => sales[months[0]] != 0 || sales[months[1]] != 0);
      this.finalData = this.finalData.filter(sales => 
        sales[months[0]] != 0 || 
        sales[months[1]] != 0 || sales['Closing Stock\n' + months[1]] != 0
      );
    } else if (months.length == 3) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || 
        sales[months[2]] != 0 || sales['Closing Stock\n' + months[2]] != 0
      );
    } else if (months.length == 4) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || 
        sales[months[3]] != 0 || sales['Closing Stock\n' + months[3]] != 0
      );
    } else if (months.length == 5) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales['Closing Stock\n' + months[4]] != 0
      );
    } else if (months.length == 6) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales['Closing Stock\n' + months[5]] != 0
      );
    } else if (months.length == 7) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || 
        sales[months[6]] != 0 || sales['Closing Stock\n' + months[6]] != 0
      );
    } else if (months.length == 8) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || 
        sales[months[7]] != 0 || sales['Closing Stock\n' + months[7]] != 0
      );
    } else if (months.length == 9) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales['Closing Stock\n' + months[8]] != 0
      );
    } else if (months.length == 10) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales[months[9]] != 0 || sales['Closing Stock\n' + months[9]] != 0
      );
    } else if (months.length == 11) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales[months[9]] != 0 || 
        sales[months[10]] != 0 || sales['Closing Stock\n' + months[10]] != 0
      );
    } else if (months.length == 12) {
      this.finalData = this.finalData.filter(sales =>
        sales[months[0]] != 0 || sales[months[1]] != 0 || sales[months[2]] != 0 || sales[months[3]] != 0 ||
        sales[months[4]] != 0 || sales[months[5]] != 0 || sales[months[6]] != 0 || sales[months[7]] != 0 ||
        sales[months[8]] != 0 || sales[months[9]] != 0 || sales[months[10]] != 0 || 
        sales[months[11]] != 0 || sales['Closing Stock\n' + months[11]] != 0
      );
    }

    // Sort finalData by Product Name
    this.finalData = this.finalData.sort((a, b) => a['Product'].localeCompare(b['Product']));

    // Sort finalData by division
    this.finalData = this.finalData.sort((a, b) => a['Division'].localeCompare(b['Division']));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.finalData);
    // const merge = [
    //   { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } },{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
    // ];
    // ws["!merges"] = merge;

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

  getSales() {
    this.apiService.get('/api/sales', '').subscribe((response: any) => {
      if (response.status === 200) {
        this.salesData = response.data;

        if (response.data && response.data.length) {
          // Get products as per selected division
          this.getProducts();
        }

        /* 
        // GROUP BY MONTHYEAR
        // this gives an object with dates as keys
        const groups = response.data.reduce((groups, game) => {
          const date = game.monthYear.split('T')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(game);
          return groups;
        }, {});

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
          return {
            date,
            games: groups[date]
          };
        });

        console.log(groupArrays);*/
      }
    });
  }

  async getProducts() {
    const stockData: any = await this.getStocks();

    this.selectedDivision.forEach(division => {
      this.apiService.get('/api/product', division).subscribe((response: any) => {
        if (response.status === 200) {
          response.data.forEach(product => {
            const productData = {
              'Distributor': 'Nandini Enterprises',
              'Division': '',
              'Material Code': product.materialCode,
              'Product': product.name
            }

            // Break down month wise data
            this.selectedDate.forEach((date, index) => {
              productData[moment(date).format("MMM YYYY")] = 0;

              // Collect data by matching division, material code and date
              const filteredData = this.salesData.filter(sales =>
                sales.divSAPcode == product.divSAPcode &&
                sales.materialCode == product.materialCode &&
                sales.monthYear == date
              );
              
              // Fill value for the division and particular month.
              if (filteredData && filteredData.length) {
                productData['Division'] = filteredData[0].division;
                productData[moment(date).format("MMM YYYY")] = filteredData[0].totalQty;
              }

              if (this.selectedDate.length === parseInt(index) + 1) {
                const filteredData2 = stockData.filter(stock =>
                  stock.divSAPcode == product.divSAPcode &&
                  stock.materialCode == product.materialCode
                );

                if (filteredData2 && filteredData2.length) {
                  productData['Division'] = filteredData2[0].division;
                  productData['Closing Stock\n' + moment(date).format("MMM YYYY")] = filteredData2[0].totalQty;
                  productData['Closing Stock\nValue ' + moment(date).format("MMM YYYY")] = filteredData2[0].totalValue;
                } else {
                  productData['Closing Stock\n' + moment(date).format("MMM YYYY")] = 0;
                  productData['Closing Stock\nValue ' +  moment(date).format("MMM YYYY")] = 0;
                }
              }
            });
            this.finalData.push(productData);
          });
        }
      });
    });
  }

  getStocks = () => {
    return new Promise(resolve => {
      const data = [];
      const reqData = {
        plantCode: '9011',
        divSAPcode: ['2', '6'],
        monthYear: '2022-08-01'
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

  createForm() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      glcode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[0-9]*$/)]],
      ifsc: ['', [Validators.required]],
      account: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      altphone: [''],
      type: ['', [Validators.required]],
      isco: ['', [Validators.required]],
      opercent: ['100', [Validators.required, Validators.pattern(/^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?)$/)]],
      addestate: true,
      coowners: this.fb.array([]),
    });
  }

  onSubmit() {
    /* this.submitted = true;
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
            this.router.navigateByUrl('/asset/create?owner=' + response.data._id + '&type=' + this.myForm.value.type);
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
    } */

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
