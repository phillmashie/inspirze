import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  forwardRef,
  OnDestroy,
  Injector,
  DoCheck,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import Quill from 'quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
declare var $: any;

const SELECTOR = 'quill-material';

@Component({
  selector: SELECTOR,
  templateUrl: './quill-material.component.html',
  styleUrls: ['./quill-material.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => QuillMaterialComponent),
    multi: true
  },
  {
    provide: MatFormFieldControl,
    useExisting: QuillMaterialComponent
  }],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class QuillMaterialComponent implements OnInit, DoCheck, OnDestroy, ControlValueAccessor, MatFormFieldControl<any> {
  public content:any;
  static nextId = 0;
  @HostBinding() id = `quill-material-${QuillMaterialComponent.nextId++}`;

  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;

  stateChanges = new Subject<void>();

  quill: any = Quill;
  editor: any;
  controlType = 'quill-material';
  errorState = false;
  ngControl: any;
  touched = false;
  focused = false;
  @Input() componentid: any;
  selectedComponentId: string;

  private writingValue = false;
  private defaultOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link', 'image', 'video'],                         // link and image, video
        ["insert_template"]                                 //custom button

      ]
    }
  };

  _value: any;

  get value(): any {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.editor.setContents(this._value);
    this.onChange(value);
    this.stateChanges.next();
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  public _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  public _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  @Output() contentanswer = new EventEmitter();
  set disabled(disabled) {
    this._disabled = coerceBooleanProperty(disabled);
    this.stateChanges.next();
  }
  public _disabled = false;

  get empty() {
    const text = this.editor.getText().trim();
    return text ? false : true;
  }

  @Input()
  options: any = null;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }


  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  constructor(public elRef: ElementRef, public injector: Injector, public fm: FocusMonitor) {
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }
  setContent(){
    console.log(this.componentid + "trigger");
    this.selectedComponentId = this.componentid;
    console.log(this.selectedComponentId);
    if ($("#mymaineditor" + (this.componentid ? this.componentid : "")).hasClass("fr-fullscreen")) {
      $("#selection_box").css("padding-left", "0px");
    } else {
      $("#selection_box").css("padding-left", "0px");
    }

    $("#selection_box").show();
   }

  ngOnInit(): void {
    // avoid Cyclic Dependency
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; }

    const editorRef = this.container.nativeElement.querySelector('.editor');
    const options = this.options || this.defaultOptions;
    if (typeof options.theme === 'undefined') {
      options.theme = 'snow';
    }
    this.editor = new Quill(editorRef, options);
    this.editor.on('text-change', () => {
      if (!this.writingValue) {
        this.onChange(this.getValue());
      }
    });

    this.quill.DefineIcon("insert_template" + this.componentid, { NAME: "plus", SVG_KEY: "add" });
    this.quill.RegisterCommand("insert_template" + this.componentid, {
      title: "Insert Template Content",
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      showOnMobile: false,
      callback: () => {
        this.setContent();
        // console.log(this.componentid + "trigger");
        // this.selectedComponentId = this.componentid;
        // console.log(this.selectedComponentId);
        // if ($("#mymaineditor" + (this.componentid ? this.componentid : "")).hasClass("fr-fullscreen")) {
        //   $("#selection_box").css("padding-left", "0px");
        // } else {
        //   $("#selection_box").css("padding-left", "0px");
        // }

        // $("#selection_box").show();
      },
    });
    setTimeout(() => {
      this.updateSections();
    }, 1000);
  }

  @HostListener("window:message", ["$event"])
  onMessage(e) {
    console.log(this.componentid);
    if(this.selectedComponentId == this.componentid){
      console.log("this one should work");

      if (e.origin != "http://localhost:4201") {
        // set your origin
        return false;
      }
      this.content += e.data.message;
      this.contentanswer.emit(this.content);
      $("#selection_box").hide();
      setTimeout(() => {
        this.updateSections();
      }, 1000);
    }
    this.selectedComponentId = "";
  }

  updateSections() {

  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched && !this.focused;
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  writeValue(contents: any): void {
    if (this.editor && contents) {
      this.writingValue = true;
      const delta = this.editor.clipboard.convert(contents); // convert html to delta
      this.editor.setContents(delta);
      this._value = contents;
      this.writingValue = false;
    }
  }

  onChange = (delta: any) => { };

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  onTouched = () => { };

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onContainerClick(event: MouseEvent) {
    if (!this.focused) {
      this.editor.focus();
      this.focused = true;
      this.stateChanges.next();
    }
  }

  private getValue(): any | undefined {
    if (!this.editor) {
      return undefined;
    }

    const delta: any = this.editor.getContents();
    if (this.isEmpty(delta)) {
      return undefined;
    }

    const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
    const html = converter.convert();

    return html;
  }

  private isEmpty(contents: any): boolean {
    if (contents.ops.length > 1) {
      return false;
    }

    const opsTypes: Array<string> = Object.keys(contents.ops[0]);

    if (opsTypes.length > 1) {
      return false;
    }

    if (opsTypes[0] !== 'insert') {
      return false;
    }

    if (contents.ops[0].insert !== '\n') {
      return false;
    }

    return true;
  }
}
