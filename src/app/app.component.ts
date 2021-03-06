import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as XLSX from 'xlsx';
import {HttpClient} from '@angular/common/http';
import {Entry, isActive, isNew, Type} from '../models/entry';
import Fuse from 'fuse.js/dist/fuse.min.js';
import {MatSidenav} from '@angular/material/sidenav';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {InfoPanelComponent} from './info-panel/info-panel.component';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private bottomSheet: MatBottomSheet,
    private ga: Angulartics2GoogleAnalytics,
    private router: Router
  ) {
    const date = new Date();
    this.currentMonthPedia$.next(date.getMonth() + 1);
    this.currentHourPedia$.next(date.getHours());
    this.currentMonth = date.getMonth() + 1;
    this.currentHour = date.getHours();
    this.getData();
  }
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
  filterByNew = false;
  filterByActive = false;
  searchQuery: string;
  sortOption = 'Critterpedia';

  static nextMonth(month: number): string {
    month++;
    if (month === 13) {
      month = 1;
    }
    return month.toString();
  }

  ngOnInit() {
    if (window.screen.width <= 700) {
      this.mobile = true;
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) =>
        this.ga.pageTrack(event.urlAfterRedirects));
  }


  entrySelected($event: Entry, left: MatSidenav, right: MatSidenav) {
    if (right.opened && this.mobile) {
      right.close();
      return;
    }
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

  searchFilter(query: string) {
    this.searchQuery = query;
    this.applyFilters();
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
            num: jEntry.num,
            price: jEntry.price,
            location: jEntry.location,
            weather: jEntry.weather,
            notes: jEntry.notes,
            shadow: jEntry.shadow,
            image: ('assets/' + jEntry.type + '/' + jEntry.num + '.png'),
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

    this.applyFilters();
  }

  filterCreatureTypeEvent(creatureType: Type) {
    this.filterCreatureType = creatureType;
    this.applyFilters();
  }

  applyFilters() {
    const filterFunction = (entry: Entry) => {
      return (
        entry.type === this.filterCreatureType &&
        (this.filterByCaught ? !entry.isCaught : true) &&
        (this.filterByLeaving ? !entry.activeMonths.includes(AppComponent.nextMonth(this.currentMonth))
                                && entry.activeMonths.includes(this.currentMonth.toString()) : true) &&
        (this.filterByActive ? isActive(entry, this.currentHour, this.currentMonth) : true) &&
        (this.filterByNew ? isNew(entry, this.currentMonth) : true)

      );
    };

    let filteredEntries;
    if (this.searchQuery && this.searchQuery !== '') {
      filteredEntries = this.fuse.search(this.searchQuery).map(s => s.item);
    } else {
      filteredEntries = this.entries;
    }
    filteredEntries = filteredEntries.filter(filterFunction);

    this.searchEntries = filteredEntries;
    this.displayEntries = filteredEntries;

    this.sortDisplayEntries();
  }

  filterByCaughtEvent(caught: boolean) {
    this.filterByCaught = caught;

    this.applyFilters();
  }

  filterByLeavingEvent(enableFilter: boolean) {
    this.filterByLeaving = enableFilter;
    if (this.filterByLeaving && this.filterByNew) { this.filterByNew = false; }
    this.applyFilters();
  }

  filterByNewEvent(enableFilter: boolean) {
    this.filterByNew = enableFilter;
    if (this.filterByNew && this.filterByLeaving) { this.filterByLeaving = false; }
    this.applyFilters();
  }

  filterByActiveEvent(enableFilter: boolean) {
    this.filterByActive = enableFilter;
    this.applyFilters();
  }

  sortDisplayEntries(newSortOption = null) {
    if (newSortOption) {
      this.sortOption = newSortOption;
    }
    let sortFn;
    switch (this.sortOption) {
      case 'Bells':
        sortFn = (a: Entry, b: Entry) => b.price - a.price;
        break;
      case 'Critterpedia':
        sortFn = (a: Entry, b: Entry) => a.num - b.num;
        break;
    }
    this.displayEntries.sort(sortFn);
  }
}
