import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Entry} from '../../models/entry';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() searchEntries: Entry[];
  @Output() query = new EventEmitter();
  @Output() optionSelectedEvent = new EventEmitter();
  q;
  display = (entry: Entry) => entry?.name;

  optionSelected(value: Entry) {
    this.optionSelectedEvent.emit(value);
  }

  search(q: any) {
    this.query.emit(q.name || q);
  }
}
