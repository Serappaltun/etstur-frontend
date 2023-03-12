import {Component, OnInit} from '@angular/core';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {FileMetaDto, FileService} from "../services/file.service";
import {TokenStorageService} from "../services/token-storage.service";

@Component({
  selector: 'app-add-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  currentUser: any;
  fileInfos?: FileMetaDto[];

  constructor(private fileService: FileService,
              private token: TokenStorageService) { }

  ngOnInit(): void {
    this.fetchData();
    this.currentUser = this.token.getUser();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.fileService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fetchData();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
    }
  }

  fetchData() {
    this.fileService.getFiles()
      .subscribe(data => {
        this.fileInfos = data;
      });
  }


  delete(fileMetaDto: FileMetaDto) {
    this.fileService.deleteFiles(fileMetaDto.id)
      .subscribe(data => {
        this.fetchData();
      });
  }
}
