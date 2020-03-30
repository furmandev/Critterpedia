import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Type} from '../../models/entry';
import {GoogleAnalyticsService} from 'angular-ga';

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

  constructor(
    private ga: GoogleAnalyticsService
  ) {
  }

  filterByType(value: string) {
    this.ga.event.emit({
      category: 'filter',
      action: 'filter by type'
    });

    if (value === 'fish') {
      this.filterCreatureTypeEvent.emit(Type.fish);
    } else {
      this.filterCreatureTypeEvent.emit(Type.bug);
    }
  }

  filterByCaughtChange(checked: boolean) {
    this.ga.event.emit({
      category: 'filter',
      action: 'filter by caught'
    });

    this.filterByCaughtEvent.emit(checked);
  }

  filterByLeavingChange(checked: boolean) {
    this.ga.event.emit({
      category: 'filter',
      action: 'filter by leaving'
    });

    this.filterByLeavingEvent.emit(checked);
  }

  filterByActiveChange(checked: boolean) {
    this.ga.event.emit({
      category: 'filter',
      action: 'filter by active'
    });

    this.filterByActiveEvent.emit(checked);
  }
}
