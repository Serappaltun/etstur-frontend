import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FileInfo} from "@angular-devkit/build-angular/src/utils/index-file/augment-index-html";

export class FileMetaDto {
  constructor(public id: number,
              public name: string,
              public contentType: string,
              public file: FileInfo) {
  }
}
@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://localhost:8082';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles() {
    return this.http.get<FileMetaDto[]>(`${this.baseUrl}/list-files`);
  }

  deleteFiles(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-file`+ '/' + id);
  }
}
