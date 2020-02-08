<div align="center">
  <h1>ngx-codemirror</h1>
  <br>
  <a href="https://www.npmjs.com/package/@ctrl/ngx-codemirror">
    <img src="https://badge.fury.io/js/%40ctrl%2Fngx-codemirror.svg" alt="npm">
  </a>
  <a href="https://circleci.com/gh/TypeCtrl/ngx-codemirror">
    <img src="https://circleci.com/gh/TypeCtrl/ngx-codemirror.svg?style=svg" alt="travis">
  </a>
  <a href="https://codecov.io/github/typectrl/ngx-codemirror">
    <img src="https://img.shields.io/codecov/c/github/typectrl/ngx-codemirror.svg" alt="codecov">
  </a>
  <br>
</div>

DEMO: https://ngx-codemirror.netlify.com/

## Dependencies

Latest version available for each version of Angular

| @ctrl/ngx-codemirror | Angular |
| -------------------- | ------- |
| 1.3.10               | 6.x 7.x |
| 2.2.1                | 8.x     |
| current              | >= 9.x  |

An Angular component wrapper for [CodeMirror](https://codemirror.net/) that extends ngModel
##### Based on:
[JedWatson/react-codemirror](https://github.com/JedWatson/react-codemirror) - This project is mostly a port of react-codemirror
[chymz/ng2-codemirror](https://github.com/chymz/ng2-codemirror) - Good to reference


##### Used in:
tsquery playground: https://tsquery-playground.firebaseapp.com/


## Install
`codemirror` is a peer dependency and must also be installed
```sh
npm install @ctrl/ngx-codemirror codemirror
```

## Use
Import `CodemirrorModule` and bring in the [codemirror files for parsing the langague](https://codemirror.net/mode/index.html) you wish to use.

In your `NgModule`:
```ts
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

  // add to imports:
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule,
    ...
  ]
```

In your `main.ts` or at the root of your application, see [documentation](https://codemirror.net/mode/index.html):
```ts
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
```

Import the base css file and your [theme](https://codemirror.net/demo/theme.html)
```scss
@import "~codemirror/lib/codemirror";
@import "~codemirror/theme/material";
```

Use The Component
```html
<ngx-codemirror
  [(ngModel)]="content"
  [options]="{
    lineNumbers: true,
    theme: 'material',
    mode: 'markdown'
  }"
></ngx-codemirror>
```

## Inputs
All Inputs of [ngModel](https://angular.io/api/forms/NgModel#inputs) and
* `options` - options passed to the CodeMirror instance see http://codemirror.net/doc/manual.html#config
* `name` - name applied to the created textarea
* `autoFocus` - setting applied to the created textarea
* `preserveScrollPosition` - preserve previous scroll position after updating value

## Outputs
All outputs of [ngModel](https://angular.io/api/forms/NgModel#outputs) and
* `focusChange` - called when the editor is focused or loses focus
* `scroll` - called when the editor is scrolled (not wrapped inside angular change detection must manually trigger change detection or run inside ngzone)
* `cursorActivity` - called when the text cursor is moved
* `drop` - called when file(s) are dropped

## License
MIT

---

> GitHub [@scttcper](https://github.com/scttcper) &nbsp;&middot;&nbsp;
> Twitter [@scttcper](https://twitter.com/scttcper)
