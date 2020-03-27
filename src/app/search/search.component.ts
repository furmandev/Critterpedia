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
  q;
}
