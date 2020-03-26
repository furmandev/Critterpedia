import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {

  @Input() entry$;
  @Input() currentHour$;
  @Input() currentMonth$;
  entry;

  ngOnInit(): void {
    this.entry$.subscribe(entry => {
      this.entry = entry;
    });
  }


}
