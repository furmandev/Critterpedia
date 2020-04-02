import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Type} from '../../models/entry';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @Input() filterCreatureType: Type;
  @Input() filterByLeaving: boolean;
  @Input() filterByCaught: boolean;
  @Input() filterByActive: boolean;
  @Input() sortBy: string;
  @Output() filterCreatureTypeEvent = new EventEmitter<Type>();
  @Output() filterByCaughtEvent = new EventEmitter<boolean>();
  @Output() filterByLeavingEvent = new EventEmitter<boolean>();
  @Output() filterByActiveEvent = new EventEmitter<boolean>();
  @Output() sortByEvent = new EventEmitter<string>();

  creatureType: typeof Type = Type;

  filterByType(value: string) {
    if (value === 'fish') {
      this.filterCreatureTypeEvent.emit(Type.fish);
    } else {
      this.filterCreatureTypeEvent.emit(Type.bug);
    }
  }

  filterByCaughtChange(checked: boolean) {
    this.filterByCaughtEvent.emit(checked);
  }

  filterByLeavingChange(checked: boolean) {
    this.filterByLeavingEvent.emit(checked);
  }

  filterByActiveChange(checked: boolean) {
    this.filterByActiveEvent.emit(checked);
  }
}
