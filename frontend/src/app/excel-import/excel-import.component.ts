import {Component, OnInit} from '@angular/core';
import {LightIcons} from '../values/lightIcons';
import {ExcelImportService} from '../services/excel-import.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.css']
})
export class ExcelImportComponent implements OnInit {

  zipExtension = '.zip';
  excelExtension = '.xlsx';

  faCloudUpload = LightIcons.faCloudUpload;
  faDizzy = LightIcons.faDizzy;
  faTimes = LightIcons.faTimes;
  faFileArchive = LightIcons.faFileArchive;
  faFileExcel = LightIcons.faFileExcel;

  importStep = 0;
  importResult = '';
  importLog = '';
  showImportLog = true;

  filesToImport = [];


  constructor(private excelImportService: ExcelImportService, public sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  get importDisabled(): boolean {
    return this.filesToImport.length < 1;
  }

  onDrop(dragEvent): any {
    dragEvent.preventDefault();
    const droppedFiles: any[] = dragEvent.dataTransfer.files;

    for (const droppedFile of droppedFiles) {
      const droppedFileName = droppedFile.name;

      if (droppedFileName.endsWith(this.zipExtension)) {

        if (droppedFile.size > 2000000000) {
          continue;
        }

        this.addOrReplaceFile(droppedFile, this.zipExtension);
      }

      if (droppedFileName.endsWith(this.excelExtension)) {
        this.addOrReplaceFile(droppedFile, this.excelExtension);
      }
    }
  }

  onDragOver(dragEvent): any {
    dragEvent.preventDefault();
  }

  addOrReplaceFile(droppedFile: string, extension: string): void {
    const existingFile = this.filesToImport.filter(file => file.name.endsWith(extension))[0];

    if (existingFile) {
      const index = this.filesToImport.indexOf(existingFile);
      this.filesToImport.splice(index, 1);
    }

    this.filesToImport.push(droppedFile);
  }

  formatLog(unformattedImportResult: string): string {
    let formattedResult = unformattedImportResult;
    formattedResult = formattedResult.replace(/\[ERROR]/g, '<p><span style="color: #e74c3c">[ERROR]</span>');
    formattedResult = formattedResult.replace(/\[WARN]/g, '<p><span style="color: #f39c12">[WARN]</span>');
    formattedResult = formattedResult.replace(/\[INFO]/g, '<p><span style="color: #3498db">[INFO]</span>');
    return formattedResult;
  }

  reset(): void {
    this.importStep = 0;
    this.importResult = '';
    this.importLog = '';
    this.showImportLog = true;
    this.filesToImport = [];
  }

  openLog(): void {
    const blob = new Blob([this.importLog], {type: 'text/html'});
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  runImport(): void {
    this.importStep = 1;
    this.excelImportService.import(this.filesToImport).subscribe(logText => {
      this.importResult = 'Fertig';
      this.importStep = 2;
      this.importLog = this.formatLog(logText);
      this.showImportLog = true;
    }, error => {
      this.importResult = 'Ups. Das hat leider nicht funktioniert.';
      this.importStep = 2;
      this.showImportLog = false;
    });
  }

  removeFile(fileToImport: any): void {
    const index = this.filesToImport.indexOf(fileToImport);
    this.filesToImport.splice(index, 1);
  }

  getIconForFile(fileToImport: any): any {
    return fileToImport.name.endsWith(this.excelExtension) ? this.faFileExcel : this.faFileArchive;
  }
}
