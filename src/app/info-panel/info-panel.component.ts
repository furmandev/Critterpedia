import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Entry} from '../../models/entry';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent {

  @Input() entry: Entry;
  @Input() currentHour;
  @Input() currentMonth;
  @Output() caught = new EventEmitter<Entry>();
  @Output() uncaught = new EventEmitter<Entry>();

}
