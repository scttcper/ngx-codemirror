import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MdoButtonModule } from '@ctrl/ngx-github-buttons';

import { CodemirrorModule } from '../lib/public_api';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

describe('AppComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent, FooterComponent],
        imports: [BrowserModule, FormsModule, CodemirrorModule, MdoButtonModule],
      }).compileComponents();
    }),
  );
  it(
    'should create the app',
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }),
  );
});
