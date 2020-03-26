import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {query} from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  @Input() searchOptions;
  @Output() query = new EventEmitter();
  options = ["1", "2"];
  q;


  typed() {
    this.query.emit(this.q);
  }
}
