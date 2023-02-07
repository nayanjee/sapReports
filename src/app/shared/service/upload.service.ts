import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
@Injectable({
 providedIn: 'root'
})
export class UploadService {
 
 constructor(
   private httpClient: HttpClient,
 ) { }
 
 public uploadFile(file: File) {
   let formParams = new FormData();
   formParams.append('file', file);
   console.log('formParams---', formParams);
   return this.httpClient.post('http://localhost:7873/api/uploadFile', formParams)
 }
}