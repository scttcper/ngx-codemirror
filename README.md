<div align="center">
  <h1>ngx-codemirror</h1>
  <br>
  <a href="https://www.npmjs.com/package/@ctrl/ngx-codemirror">
    <img src="https://badge.fury.io/js/%40ctrl%2Fngx-codemirror.svg" alt="npm">
  </a> 
  <a href="https://travis-ci.org/TypeCtrl/ngx-codemirror">
    <img src="https://travis-ci.org/TypeCtrl/ngx-codemirror.svg?branch=master" alt="travis">
  </a> 
  <a href="https://codecov.io/github/typectrl/ngx-codemirror">
    <img src="https://img.shields.io/codecov/c/github/typectrl/ngx-codemirror.svg" alt="codecov">
  </a>
  <br>
  DEMO: https://typectrl.github.io/ngx-codemirror/
</div>
<br>
<br>

An Angular component wrapper for [CodeMirror](https://codemirror.net/) that extends ngModel
__Based on:__  
https://github.com/JedWatson/react-codemirror - This project is mostly a port of react-codemirror
https://github.com/chymz/ng2-codemirror - Good to reference

## Install
`codemirror` is a peer dependency and must also be installed  
```sh
npm install @ctrl/ngx-codemirror codemirror
```

## Use
Import `CodemirrorModule` and bring in the [codemirror files for parsing the langague](https://codemirror.net/mode/index.html) you wish to use.
```ts
// Added to NgModule
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

// Import your required language in main.ts or at the root of your application
// see https://codemirror.net/mode/index.html
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
```

Import the css files
```scss
@import "~codemirror/lib/codemirror.css";
@import "~codemirror/theme/material.css";
```

Use The Component
```html
<ngx-codemirror 
  [(ngModel)]="content" 
  [options]="{
    lineNumbers: true,
    mode: 'markdown'
  }"
></ngx-codemirror>
```

## Inputs
All Inputs of [ngModel](https://angular.io/api/forms/NgModel#inputs)  
* `options` - options passed to the CodeMirror instance see http://codemirror.net/doc/manual.html#config
* `name` - name applied to the created textarea
* `autoFocus` - setting applied to the created textarea
* `preserveScrollPosition` - preserve previous scroll position after updating value

## Outputs
All outputs of [ngModel](https://angular.io/api/forms/NgModel#outputs)  
* `focusChange` - called when the editor is focused or loses focus
* `scroll` - called when the editor is scrolled
* `cursorActivity` - called when the text cursor is moved

## License
MIT
