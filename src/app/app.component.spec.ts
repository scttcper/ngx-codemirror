import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ButtonService } from '@ctrl/ngx-github-buttons';
import { MdoButtonModule } from '@ctrl/ngx-github-buttons';
import { of as ObservableOf } from 'rxjs';

import { CodemirrorModule } from '../lib/public_api';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';

class FakeButtonService {
  repo(user: string, repo: string) {
    return ObservableOf({ stargazers_count: 0 });
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, FooterComponent],
      imports: [BrowserModule, FormsModule, CodemirrorModule, MdoButtonModule],
      providers: [{ provide: ButtonService, useClass: FakeButtonService }],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
