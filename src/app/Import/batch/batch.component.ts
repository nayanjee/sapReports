import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { faStar, faPlus } from '@fortawesome/free-solid-svg-icons';

import { UploadService } from '../../shared/service/upload.service';
import { AppServicesService } from './../../shared/service/app-services.service';

declare var $: any;

@Component({
  selector: 'app-import-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class ImportBatchComponent implements OnInit {
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;

  loggedUserId: any = '';
  faStar = faStar;
  faPlus = faPlus;
  heading = 'Import Batch';
  subheading = 'Batch excel import/upload from sap data.';
  icon = 'pe-7s-user icon-gradient bg-premium-dark';

  myForm: FormGroup;
  type: string = '';
  ownerPercent = '';
  coOwnerNumber = '';
  submitted = false;
  btnLoader = false;
  selectedType: string = '';

  private fileName;

  image: any;
  file: File = null;

  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:7873/api/upload',
    itemAlias: 'image'
  });

  fileInputLabel: string;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private uploadService: UploadService,
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

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);
      // this.toastr.success('File successfully uploaded!');
    };

    if (this.type) {
      this.selectedType = this.type;
      this.myForm.controls['type'].setValue(this.type, { onlySelf: true });
      this.myForm.value.type = this.type;
    }
  }

  get f() { return this.myForm.controls; }

  createForm() {
    this.myForm = this.fb.group({
      uploadedImage: ['']
    });
  }

  onFileSelect(event) {
    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    this.myForm.get('uploadedImage').setValue(file);
  }

  onSubmit() {
    if (!this.myForm.get('uploadedImage').value) {
      alert('Please fill valid details!');
      return false;
    }

    console.log('this.myForm---', this.myForm);

    const formData = new FormData();
    formData.append('uploadedImage', this.myForm.get('uploadedImage').value);
    formData.append('agentId', '007');
    console.log('formData---', formData);

    this.http
      .post<any>('http://localhost:7873/api/uploadFile', formData).subscribe(response => {
        console.log(response);
        // if (response.statusCode === 200) {
        //   // Reset the file input
        //   this.uploadFileInput.nativeElement.value = "";
        //   this.fileInputLabel = undefined;
        // }
      }, er => {
        console.log(er);
        alert(er.error.error);
      });

    // this.apiService.post('/api/batchImport', formParams).subscribe((response: any) => {
    //   if (response.status === 200) {

    //   }
    // });


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
