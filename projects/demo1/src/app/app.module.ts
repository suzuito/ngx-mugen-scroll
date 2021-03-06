import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxMugenScrollModule } from 'ngx-mugen-scroll';
import { Demo1Component } from './demo1/demo1.component';
import { TopComponent } from './top/top.component';
import { Demo2Component } from './demo2/demo2.component';
import { LoggerComponent } from './logger/logger.component';
import { Debug1Component } from './debug1/debug1.component';
import { Demo3Component } from './demo3/demo3.component';
import { NgxGeojsonGlobeViewerModule } from 'projects/ngx-geojson-globe-viewer/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    Demo1Component,
    TopComponent,
    Demo2Component,
    LoggerComponent,
    Debug1Component,
    Demo3Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMugenScrollModule,
    NgxGeojsonGlobeViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
