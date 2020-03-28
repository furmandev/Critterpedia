import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as XLSX from 'xlsx';
import {HttpClient} from '@angular/common/http';
import {Entry, Type} from '../models/entry';
import Fuse from 'fuse.js/dist/fuse.min.js';
import {MatSidenav} from '@angular/material/sidenav';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {InfoPanelComponent} from './info-panel/info-panel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Critterpedia';
  currentMonthPedia$ = new BehaviorSubject(0);
  currentHourPedia$ = new BehaviorSubject(0);
  currentMonth;
  currentHour;
  dataUrl = 'assets/data.xlsx';
  entries: Entry[] = [];
  displayEntries: Entry[] = [];
  searchEntries: Entry[] = [];
  private fuse;
  mobile: boolean;
  selectedEntry: Entry;
  filterCreatureType = Type.fish;
  filterByCaught = false;
  filterByLeaving = false;

  ngOnInit() {
    if (window.screen.width <= 700) {
      this.mobile = true;
    }
  }

  constructor(
    private http: HttpClient,
    private bottomSheet: MatBottomSheet
  ) {
    const date = new Date();
    this.currentMonthPedia$.next(date.getMonth() + 1);
    this.currentHourPedia$.next(date.getHours());
    this.currentMonth = date.getMonth() + 1;
    this.currentHour = date.getHours();
    this.getData();
  }


  entrySelected($event: Entry, left: MatSidenav) {
    this.selectedEntry = $event;
    if (!this.mobile) {
      left.open();
    } else {
      const info = this.bottomSheet.open(InfoPanelComponent);

      info.instance.entry = this.selectedEntry;
      info.instance.currentMonth = this.currentMonth;
      info.instance.currentHour = this.currentHour;
      info.instance.caught.subscribe(e => {
        this.caught(e, true);
      });
      info.instance.uncaught.subscribe(e => {
        this.caught(e, false);
      });
    }
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
      const caughtBugs = localStorage.getItem('bugs')?.split(',');

      bufferPromise.then(buffer => {

        const workbook = XLSX.read(buffer, {type: 'array'});

        const sheet = workbook.Sheets.Sheet1;

        const json = XLSX.utils.sheet_to_json(sheet);

        this.entries = json.map(e => {
          const jEntry = e as any;
          return {
            activeHours: jEntry.activeHours?.toString().split(' ') || [],
            activeMonths: jEntry.activeMonths?.toString().split(' ') || [],
            type: jEntry.type === 'fish' ? Type.fish : Type.bug,
            name: jEntry.name,
            image: jEntry.image,
            num: jEntry.num,
            price: jEntry.price,
            location: jEntry.location,
            weather: jEntry.weather,
            notes: jEntry.notes,
            shadow: jEntry.shadow,
            isCaught: jEntry.type === 'fish' ? (caughtFish?.includes(jEntry.num.toString())) : (caughtBugs?.includes(jEntry.num.toString()))
          };
        });

        this.displayEntries = this.entries.filter(e => e.type === Type.fish);

        this.displayEntries = this.entries.filter(e => e.type === Type.fish);

        this.fuse = new Fuse(this.entries, {keys: ['name'], threshold: 0.3});

      });
    });
  }

  caught(entry, isCaught) {
    entry.isCaught = isCaught;
    const local = localStorage.getItem(entry.type === Type.fish ? 'fish' : 'bugs')?.split(',') || [];
    if (isCaught) {
      local.push(entry.num.toString());
    } else {
      local.splice(local.indexOf(entry.num.toString()), 1);
    }
    localStorage.setItem(entry.type === Type.fish ? 'fish' : 'bugs', local.join(','));
  }

  filterCreatureTypeEvent(creatureType: Type) {
    this.filterCreatureType = creatureType;
    this.applyFilters();
  }

  applyFilters() {
    this.displayEntries = this.entries;
    this.searchEntries = this.entries;

    const filter = (entry: Entry) => {
      return (
        entry.type === this.filterCreatureType &&
        (this.filterByCaught ? !entry.isCaught : true) &&
        (this.filterByLeaving ? !entry.activeMonths.includes(this.nextMonth(this.currentMonth))
                                && entry.activeMonths.includes(this.currentMonth.toString()) : true)
      );
    };

    this.displayEntries = this.displayEntries.filter(filter);
    this.searchEntries = this.searchEntries.filter(filter);
  }

  filterByCaughtEvent(caught: boolean) {
    this.filterByCaught = caught;

    this.applyFilters();
  }

  filterByLeavingEvent(filter: boolean) {
    this.filterByLeaving = filter;

    this.applyFilters();
  }

  nextMonth(month: number): string {
    month++;
    if (month === 13) {
      month = 1;
    }
    return month.toString();
  }
}
