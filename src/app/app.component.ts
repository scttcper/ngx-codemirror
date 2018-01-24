import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  swag = 'app';
  options = {};

  changeOptions() {
    this.options = { lineNumbers: true };
    this.swag = '<div>OKAY</div>'
  }
}
