import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {LandingpageComponent} from './landingpage/landingpage.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {EntryDetailComponent} from './entry-detail/entry-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EntryNotFoundComponent} from './entry-not-found/entry-not-found.component';
import {AlphabeticalOverviewComponent} from './alphabetical-overview/alphabetical-overview.component';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PageComponent} from './page/page.component';
import {SwiperModule} from 'swiper/angular';
import {SwiperVideoMetadataComponent} from './swiper-video-metadata/swiper-video-metadata.component';
import {ContactComponent} from './contact/contact.component';
import {NgxCaptchaModule} from 'ngx-captcha';
import {EntryTitleDisplayComponent} from './entry-title-display/entry-title-display.component';
import {SuggestionComponent} from './suggestion/suggestion.component';
import {MathModule} from './math/math.module';
import {EntryDefinitionComponent} from './entry-definition/entry-definition.component';
import {VideoShareComponent} from './video-share/video-share.component';
import {SearchResultEntryComponent} from './search-result-entry/search-result-entry.component';
import {SearchMenuComponent} from './search-menu/search-menu.component';
import {TextSearchComponent} from './text-search/text-search.component';
import {GebaerdenschriftSearchComponent} from './gebaerdenschrift-search/gebaerdenschrift-search.component';
import {GebaerdenTastaturComponent} from './gebaerden-tastatur/gebaerden-tastatur.component';
import {SearchFilterComponent} from './search-filter/search-filter.component';
import {ExcelImportComponent} from './excel-import/excel-import.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { IconSpacerComponent } from './icon-spacer/icon-spacer.component';
import { PhotoGridComponent } from './photo-grid/photo-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    FooterComponent,
    HeaderComponent,
    EntryDetailComponent,
    EntryNotFoundComponent,
    AlphabeticalOverviewComponent,
    PageComponent,
    SwiperVideoMetadataComponent,
    ContactComponent,
    EntryTitleDisplayComponent,
    SuggestionComponent,
    EntryDefinitionComponent,
    VideoShareComponent,
    SearchResultEntryComponent,
    SearchMenuComponent,
    TextSearchComponent,
    GebaerdenschriftSearchComponent,
    GebaerdenTastaturComponent,
    SearchFilterComponent,
    ExcelImportComponent,
    SafeHtmlPipe,
    IconSpacerComponent,
    PhotoGridComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    FontAwesomeModule,
    SwiperModule,
    NgxCaptchaModule,
    MathModule.forRoot(),
    DragDropModule
  ],
  providers: [{provide: Window, useValue: window}],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {
  }
}
