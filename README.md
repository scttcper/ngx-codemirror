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
```sh
npm install @ctrl/ngx-codemirror
```

## Use
```ts
// Added to NgModule
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
```

```html
<ngx-codemirror 
  [(ngModel)]="this.defaults[this.mode]" 
  [options]="options"
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
