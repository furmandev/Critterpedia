import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Entry, isActive, Type} from '../../models/entry';


@Component({
  selector: 'app-pedia',
  templateUrl: './pedia.component.html',
  styleUrls: ['./pedia.component.css']
})

export class PediaComponent {

  @Output() selectedEntry = new EventEmitter();
  @Input() currentHour$;
  @Input() currentMonth$;
  @Input() entries: Entry[];
  creatureType: typeof Type = Type;


  entrySelected($event) {
    this.selectedEntry.emit($event);
  }

  getStyle(entry: any, month, hour) {
    if (isActive(entry, hour, month)) {
      return {};
    }
    return {filter: 'grayscale(1)'};
  }
}
