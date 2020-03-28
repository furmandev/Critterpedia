import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {InfoPanelComponent} from './info-panel/info-panel.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {PediaComponent} from './pedia/pedia.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HttpClientModule} from '@angular/common/http';
import {SettingsComponent} from './settings/settings.component';
import {SearchComponent} from './search/search.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    InfoPanelComponent,
    PediaComponent,
    SettingsComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    HttpClientModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
  ],
  providers: [
    {provide: 'googleTagManagerId',  useValue: 'GTM-KX9VB2T'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
