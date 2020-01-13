import { CoreUtil } from './../common/core-util';
import { AppConsts } from './../../shared/util/app-consts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly url = `${AppConsts.BASE_URL}/api/v1/storage`;
  constructor(private http: HttpClient) { }

  public upload(fileToUpload: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append(AppConsts.FORM_DATA_FILE_UPLOAD_KEY, fileToUpload, fileToUpload.name);
    return this.http
      .post(this.url, formData, { headers: CoreUtil.createAuthorizationHeader(), responseType: 'text' })
      .pipe(map(res => res as string));
  }

  public delete(fileUrl: string): Observable<any> {
    const headers: HttpHeaders = CoreUtil.createAuthorizationHeader();
    const formData: FormData = new FormData();
    formData.append(AppConsts.FORM_DATA_FILE_DELETE_KEY, fileUrl);
    const options = {
      headers,
      body: formData,
    };
    return this.http.delete(this.url, options);
  }

  public uploadImage(imageToUpload: File, defaultResult: string): Observable<string> {
    if (!imageToUpload) {
      return of(defaultResult);
    }

    return this.upload(imageToUpload);
  }
}

