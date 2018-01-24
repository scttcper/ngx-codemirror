import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CodemirrorModule } from '../lib/codemirror.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, CodemirrorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
