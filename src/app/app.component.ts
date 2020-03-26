import { Component } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import * as XLSX from 'xlsx';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Critterpedia';
  selectedEntry$ = new Subject();
  currentMonthPedia$ = new BehaviorSubject(0);
  currentHourPedia$ = new BehaviorSubject(0);
  currentMonthInfo$ = new BehaviorSubject(0);
  currentHourInfo$ = new BehaviorSubject(0);
  http;
  dataUrl = 'assets/data.xlsx';
  entries = [];
  searchOptions = [];

  constructor(http: HttpClient) {
    this.http = http;
    const date = new Date();
    this.currentMonthPedia$.next(date.getMonth() + 1);
    this.currentHourPedia$.next(date.getHours());
    this.currentMonthInfo$.next(date.getMonth() + 1);
    this.currentHourInfo$.next(date.getHours());
    this.getData();
  }


  entrySelected($event: any) {
    this.selectedEntry$.next($event);
  }

  searchFilter($event: any) {
    console.log($event);
  }


  getData() {
    this.http.get(this.dataUrl, {responseType: 'blob'}).subscribe(result => {
      const bufferPromise = result.arrayBuffer();

      bufferPromise.then(buffer => {

        const workbook = XLSX.read(buffer, {type: 'array'});

        const sheet = workbook.Sheets.Sheet1;

        const json = XLSX.utils.sheet_to_json(sheet);

        this.entries = json.map(e => {
          const entry = e as any;
          entry.activeHours = entry.activeHours.toString().split(' ') || [];
          entry.activeMonths = entry.activeMonths.toString().split(' ') || [];
          return entry;
        });

        this.searchOptions = this.entries.map(e => e.name);
      });
    });
  }

}
