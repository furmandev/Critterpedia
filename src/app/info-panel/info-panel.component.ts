import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Entry} from '../../models/entry';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {

  @Input() entry$;
  @Input() currentHour$;
  @Input() currentMonth$;
  @Output() caught = new EventEmitter<Entry>();
  @Output() uncaught = new EventEmitter<Entry>();
  entry: Entry;

  ngOnInit(): void {
    this.entry$.subscribe(entry => {
      this.entry = entry;
    });
  }
}
