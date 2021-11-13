import { Component } from '@angular/core';

const defaults = {
  markdown:
    '# Heading\n\nSome **bold** and _italic_ text\nBy [Scott Cooper](https://github.com/scttcper)',
  'text/typescript': `const component = {
  name: "@ctrl/ngx-codemirror",
  author: "Scott Cooper",
  repo: "https://github.com/scttcper/ngx-codemirror"
};
const hello: string = 'world';`,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  readOnly = false;
  mode: keyof typeof defaults = 'markdown';
  options = {
    lineNumbers: true,
    mode: this.mode,
  };
  defaults = defaults;

  changeMode(): void {
    this.options = {
      ...this.options,
      mode: this.mode,
    };
  }

  handleChange($event: Event): void {
    console.log('ngModelChange', $event);
  }

  clear(): void {
    this.defaults[this.mode] = '';
  }
}
