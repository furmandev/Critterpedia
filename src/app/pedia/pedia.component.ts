import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-pedia',
  templateUrl: './pedia.component.html',
  styleUrls: ['./pedia.component.css']
})
export class PediaComponent  {

  @Output() selectedEntry = new EventEmitter();
  @Output() openInfo = new EventEmitter();
  @Input() currentHour$;
  @Input() currentMonth$;
  @Input() entries;

  entrySelected($event, force = false) {
    this.selectedEntry.emit($event);
    if (force) { this.openInfo.emit(); }
  }

  getStyle(entry: any, month, hour) {
    if (entry.activeHours.includes(hour.toString()) && entry.activeMonths.includes(month.toString())) {
      return { };
    }
    return { filter: 'grayscale(1)'};
  }
}
