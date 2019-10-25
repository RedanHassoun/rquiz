import { Observable } from 'rxjs';
import { ImageSnippet } from './../models/image-snippet';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private http: HttpClient,
              private af: AngularFire,
              private db: AngularFireDatabase) { }

  public processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      const selectedFile = new ImageSnippet(file);

      this.uploadImage(selectedFile.file).subscribe(
        (res) => {

        },
        (err) => {

        });
    });

    reader.readAsDataURL(file);
  }

  public uploadImage(image: File): Observable<Response> {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post('/api/v1/image-upload', formData)
      .pipe(map(response => {
        return response as Response;
      }));
  }
}
