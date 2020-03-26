import { CoreUtil } from './../common/core-util';
import { AppConsts } from './../../shared/util/app-consts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { BadInputError } from 'src/app/shared/app-errors';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private static readonly MAX_IMAGE_SIZE_BYTES = 10485760;

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

    if (imageToUpload.size > FileUploadService.MAX_IMAGE_SIZE_BYTES) {
      return throwError(
        new BadInputError(
          `Cannot upload an image with more than ${this.byteToMegabyte(FileUploadService.MAX_IMAGE_SIZE_BYTES)} MB.`));
    }

    return this.upload(imageToUpload);
  }

  private byteToMegabyte(numOfBytes: number): number {
    if (!numOfBytes) {
      return null;
    }

    return Math.floor(numOfBytes / 1048576);
  }
}
