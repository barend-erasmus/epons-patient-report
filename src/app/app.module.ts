// Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { CompletedMeasurementToolComponent } from './completed-measurement-tool/completed-measurement-tool.component';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CompletedMeasurementToolComponent,
    VitalSignsComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
