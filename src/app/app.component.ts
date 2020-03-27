import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import * as XLSX from 'xlsx';
import {HttpClient} from '@angular/common/http';
import {Entry, Type} from '../models/entry';
import Fuse from 'fuse.js/dist/fuse.min.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Critterpedia';
  selectedEntry$ = new Subject<Entry>();
  currentMonthPedia$ = new BehaviorSubject(0);
  currentHourPedia$ = new BehaviorSubject(0);
  currentMonthInfo$ = new BehaviorSubject(0);
  currentHourInfo$ = new BehaviorSubject(0);
  http: HttpClient;
  dataUrl = 'assets/data.xlsx';
  entries: Entry[] = [];
  displayEntries: Entry[] = [];
  searchEntries: Entry[] = [];
  private fuse;
  mobile: boolean;

  ngOnInit() {
    if (window.screen.width === 360) { // 768px portrait
      this.mobile = true;
    }
  }

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


  updateEntries() {
    this.displayEntries = this.entries;
    this.searchEntries = this.entries;
  }


  searchFilter($event: any) {
    console.log($event);
    if (!$event) {
      this.searchEntries = this.entries;
      this.displayEntries = this.entries;
      return;
    }
    this.searchEntries = this.fuse.search($event).map(s => s.item);
    this.displayEntries = this.searchEntries;
  }


  getData() {
    this.http.get(this.dataUrl, {responseType: 'blob'}).subscribe(result => {
      // @ts-ignore
      const bufferPromise = result.arrayBuffer();

      const caughtFish = localStorage.getItem('fish')?.split(',');

      bufferPromise.then(buffer => {

        const workbook = XLSX.read(buffer, {type: 'array'});

        const sheet = workbook.Sheets.Sheet1;

        const json = XLSX.utils.sheet_to_json(sheet);

        this.entries = json.map(e => {
          const jEntry = e as any;
          return {
            activeHours:  jEntry.activeHours.toString().split(' ') || [],
            activeMonths: jEntry.activeMonths.toString().split(' ') || [],
            type: jEntry.type === 'fish' ? Type.fish : Type.bug,
            name: jEntry.name,
            image: jEntry.image,
            num: jEntry.num,
            price: jEntry.price,
            location: jEntry.location,
            weather: jEntry.weather,
            notes: jEntry.notes,
            shadow: jEntry.shadow,
            isCaught: caughtFish?.includes(jEntry.num.toString())
          };
        });

        this.searchEntries = this.entries;

        this.displayEntries = this.entries;

        this.fuse = new Fuse(this.entries, {keys: ['name'], threshold: 0.3});

      });
    });
  }

  caught(entry, isCaught) {
    entry.isCaught = isCaught;
    const fish = localStorage.getItem('fish')?.split(',') || [];
    if (isCaught) {
      fish.push(entry.num.toString());
    } else {
      fish.splice(fish.indexOf(entry.num.toString()), 1);
    }
    localStorage.setItem('fish', fish.join(','));
  }
}
