import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MdoButtonModule } from '@ctrl/ngx-github-buttons';

import { CodemirrorModule } from '../lib/public_api';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [AppComponent, FooterComponent],
  imports: [BrowserModule, FormsModule, CodemirrorModule, MdoButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
