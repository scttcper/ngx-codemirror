import {
  forwardRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Editor,
  EditorChangeLinkedList,
  EditorFromTextArea,
  ScrollInfo,
} from 'codemirror';

function normalizeLineEndings(str: string) {
  if (!str) {
    return str;
  }
  return str.replace(/\r\n|\r/g, '\n');
}

declare var require: any;

@Component({
  selector: 'ngx-codemirror',
  template: `
  <textarea
    [name]="name"
    class="ngx-codemirror {{ className }}"
    [class.ngx-codemirror--focused]="isFocused"
    autocomplete="off"
    [autofocus]="autoFocus"
    #ref>
  </textarea>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodemirrorComponent),
      multi: true,
    },
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodemirrorComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor, DoCheck {
  /* class applied to the created textarea */
  @Input() className = '';
  /* name applied to the created textarea */
  @Input() name = 'codemirror';
  /* autofocus setting applied to the created textarea */
  @Input() autoFocus = false;
  /**
   * set options for codemirror
   * @link http://codemirror.net/doc/manual.html#config
   */
  @Input()
  set options(value: { [key: string]: any }) {
    this._options = value;
    if (!this._differ && value) {
      this._differ = this._differs.find(value).create();
    }
  }
  /* preserve previous scroll position after updating value */
  @Input() preserveScrollPosition = false;
  /* called when the text cursor is moved */
  @Output() cursorActivity = new EventEmitter<Editor>();
  /* called when the editor is focused or loses focus */
  @Output() focusChange = new EventEmitter<boolean>();
  /* called when the editor is scrolled */
  @Output() scroll = new EventEmitter<ScrollInfo>();
  @ViewChild('ref') ref: ElementRef;
  value = '';
  disabled = false;
  isFocused = false;
  codeMirror: EditorFromTextArea;
  private _differ: KeyValueDiffer<string, any>;
  private _options: any;

  constructor(private _differs: KeyValueDiffers, private _ngZone: NgZone) {}

  ngAfterViewInit() {
    if (!this.ref) {
      return;
    }
    // in order to allow for universal rendering, we import Codemirror runtime with `require` to prevent node errors
    const { fromTextArea } = require('codemirror');

    this._ngZone.runOutsideAngular(() => {
      this.codeMirror = fromTextArea(this.ref.nativeElement, this._options);
      this.codeMirror.on('cursorActivity', cm =>
        this._ngZone.run(() => this.cursorActive(cm)),
      );
      this.codeMirror.on('scroll', this.scrollChanged.bind(this));
      this.codeMirror.on('blur', () =>
        this._ngZone.run(() => this.focusChanged(false)),
      );
      this.codeMirror.on('focus', () =>
        this._ngZone.run(() => this.focusChanged(true)),
      );
      this.codeMirror.on(
        'change',
        (cm: Editor, change: EditorChangeLinkedList) =>
          this._ngZone.run(() => this.codemirrorValueChanged(cm, change)),
      );
      this.codeMirror.setValue(this.value);
    });
  }
  ngDoCheck() {
    if (!this._differ) {
      return;
    }
    // check options have not changed
    const changes = this._differ.diff(this._options);
    if (changes) {
      changes.forEachChangedItem(option =>
        this.setOptionIfChanged(option.key, option.currentValue),
      );
      changes.forEachAddedItem(option =>
        this.setOptionIfChanged(option.key, option.currentValue),
      );
      changes.forEachRemovedItem(option =>
        this.setOptionIfChanged(option.key, option.currentValue),
      );
    }
  }
  ngOnDestroy() {
    // is there a lighter-weight way to remove the cm instance?
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
  }
  codemirrorValueChanged(cm: Editor, change: EditorChangeLinkedList) {
    if (change.origin !== 'setValue') {
      this.value = cm.getValue();
      this.onChange(this.value);
    }
  }
  setOptionIfChanged(optionName: string, newValue: any) {
    if (!this.codeMirror) {
      return;
    }
    this.codeMirror.setOption(optionName, newValue);
  }
  focusChanged(focused: boolean) {
    this.onTouched();
    this.isFocused = focused;
    this.focusChange.emit(focused);
  }
  scrollChanged(cm: Editor) {
    this.scroll.emit(cm.getScrollInfo());
  }
  cursorActive(cm: Editor) {
    this.cursorActivity.emit(cm);
  }
  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: string): void {
    if (value === null || value === undefined) {
      return;
    }
    if (!this.codeMirror) {
      this.value = value;
      return;
    }
    const cur = this.codeMirror.getValue();
    if (
      value !== cur &&
      normalizeLineEndings(cur) !== normalizeLineEndings(value)
    ) {
      this.value = value;
      if (this.preserveScrollPosition) {
        const prevScrollPosition = this.codeMirror.getScrollInfo();
        this.codeMirror.setValue(this.value);
        this.codeMirror.scrollTo(
          prevScrollPosition.left,
          prevScrollPosition.top,
        );
      } else {
        this.codeMirror.setValue(this.value);
      }
    }
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  /** Implemented as part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.setOptionIfChanged('readOnly', this.disabled);
  }
  /** Implemented as part of ControlValueAccessor. */
  private onChange = (_: any) => {};
  /** Implemented as part of ControlValueAccessor. */
  private onTouched = () => {};
}
