import {
  forwardRef,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as codemirror from 'codemirror';
import isEqual from 'lodash-es/isEqual';

@Component({
  selector: 'ngx-codemirror',
  template: `
  <textarea
    [name]="name"
    class="ngx-codemirror {{ className }}"
    [class.ngx-codemirror--focused]="isFocused"
    autocomplete="off"
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
})
export class CodemirrorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() className: string;
  @Input() name: string;
  @Input() autoFocus = false;
  @Input() options: any = {};
  @Input() path: string;
  @Input() preserveScrollPosition: boolean;
  @Output() cursorActivity = new EventEmitter<any>();
  @Output() focusChange = new EventEmitter<any>();
  @Output() scroll = new EventEmitter<any>();
  @ViewChild('ref') ref: ElementRef;
  value = '';
  disabled = false;
  isFocused = false;
  codeMirror: CodeMirror.EditorFromTextArea;

  ngAfterViewInit() {
    this.codeMirror = codemirror.fromTextArea(
      this.ref.nativeElement,
      this.options,
    );
    this.codeMirror.on('change', (doc, change) =>
      this.codemirrorValueChanged(doc, change),
    );
    // this.codeMirror.on('cursorActivity', this.cursorActivity);
    // this.codeMirror.on('focus', this.focusChanged.bind(this, true));
    // this.codeMirror.on('blur', this.focusChanged.bind(this, false));
    // this.codeMirror.on('scroll', this.scrollChanged);
    // this.codeMirror.setValue(this.value || '');
    console.log(this.value);
  }
  ngOnDestroy() {
    // is there a lighter-weight way to remove the cm instance?
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
  }
  codemirrorValueChanged(doc, change) {
    if (change.origin !== 'setValue') {
      this.value = doc.getValue();
      this.writeValue(doc.getValue());
    }
  }
  setOptionIfChanged(optionName, newValue) {
    const oldValue = this.codeMirror.getOption(optionName);
    if (!isEqual(oldValue, newValue)) {
      this.codeMirror.setOption(optionName, newValue);
    }
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: string): void {
    if (value === null) {
      return;
    }
    if (this.value !== value) {
      this.codeMirror.setValue(value || '');
      this.value = value;
    }
    this.onChange(this.value);
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
