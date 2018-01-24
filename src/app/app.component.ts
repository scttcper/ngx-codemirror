import { Component } from '@angular/core';

const defaults = {
  markdown:
    '# Heading\n\nSome **bold** and _italic_ text\nBy [Scott Cooper](https://github.com/scttcper)',
  'text/typescript':
    `const component = {
  name: "ngx-codemirror",
  author: "Scott Cooper",
  repo: "https://github.com/typectrl/ngx-codemirror"
};
const hello: string = 'world';`,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  readOnly = false;
  mode = 'markdown';
  options: any = {
    lineNumbers: true,
    mode: this.mode,
  };
  defaults = defaults;

  changeMode() {
    this.options = {
      ...this.options,
      mode: this.mode,
    };
  }
}
