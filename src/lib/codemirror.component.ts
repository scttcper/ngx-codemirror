import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
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
  EditorChange,
  EditorFromTextArea,
  ScrollInfo,
} from 'codemirror';

function normalizeLineEndings(str: string): string {
  if (!str) {
    return str;
  }
  return str.replace(/\r\n|\r/g, '\n');
}

declare var require: any;
declare var CodeMirror: any;

@Component({
  selector: 'ngx-codemirror',
  template: `
    <textarea
      [name]="name"
      class="ngx-codemirror {{ className }}"
      [class.ngx-codemirror--focused]="isFocused"
      autocomplete="off"
      [autofocus]="autoFocus"
      #ref
    >
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
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() scroll = new EventEmitter<ScrollInfo>();
  /* called when file(s) are dropped */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() drop = new EventEmitter<[Editor, DragEvent]>();
  @ViewChild('ref', { static: true }) ref!: ElementRef;
  value = '';
  disabled = false;
  isFocused = false;
  codeMirror?: EditorFromTextArea;
  /**
   * either global variable or required library
   */
  private _codeMirror: any;

  private _differ?: KeyValueDiffer<string, any>;
  private _options: any;

  constructor(private _differs: KeyValueDiffers, private _ngZone: NgZone) {}

  get codeMirrorGlobal(): any {
    if (this._codeMirror) {
      return this._codeMirror;
    }

    this._codeMirror = typeof CodeMirror !== 'undefined' ? CodeMirror : require('codemirror');
    return this._codeMirror;
  }

  ngAfterViewInit(): void {
    if (!this.ref) {
      return;
    }
    // in order to allow for universal rendering, we import Codemirror runtime with `require` to prevent node errors
    this._ngZone.runOutsideAngular(() => {
      this.codeMirror = this.codeMirrorGlobal.fromTextArea(
        this.ref.nativeElement,
        this._options,
      ) as EditorFromTextArea;
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
        (cm, change) =>
          this._ngZone.run(() => this.codemirrorValueChanged(cm, change)),
      );
      this.codeMirror.on(
        'drop',
        (cm, e) => {
          this._ngZone.run(() => this.dropFiles(cm, e));
        }
      );
      this.codeMirror.setValue(this.value);
    });
  }
  ngDoCheck(): void {
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
  ngOnDestroy(): void {
    // is there a lighter-weight way to remove the cm instance?
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
  }
  codemirrorValueChanged(cm: Editor, change: EditorChange): void {
    const cmVal = cm.getValue();
    if (this.value !== cmVal) {
      this.value = cmVal;
      this.onChange(this.value);
    }
  }
  setOptionIfChanged(optionName: string, newValue: any): void {
    if (!this.codeMirror) {
      return;
    }

    // cast to any to handle strictly typed option names
    // could possibly import settings strings available in the future
    this.codeMirror.setOption(optionName as any, newValue);
  }
  focusChanged(focused: boolean): void {
    this.onTouched();
    this.isFocused = focused;
    this.focusChange.emit(focused);
  }
  scrollChanged(cm: Editor): void {
    this.scroll.emit(cm.getScrollInfo());
  }
  cursorActive(cm: Editor): void {
    this.cursorActivity.emit(cm);
  }
  dropFiles(cm: Editor, e: DragEvent): void {
    this.drop.emit([cm, e]);
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
