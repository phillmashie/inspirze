import { Observable, Subscription } from "rxjs";
import { Component, EventEmitter, Output, ViewEncapsulation, Input, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, forwardRef } from "@angular/core";
import FroalaEditor from "froala-editor";
import { MatFormFieldControl } from "@angular/material/form-field";
import { AbstractControlDirective, NgControl, NG_VALUE_ACCESSOR } from "@angular/forms";
declare var $: any;
// declare var FroalaEditor: any;


@Component({
  selector: 'app-floalaeditor',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './floalaeditor.component.html',
  styleUrls: ['./floalaeditor.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FloalaeditorComponent),
    multi: true
  },
  {
    provide: MatFormFieldControl,
    useExisting: FloalaeditorComponent
  }],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class FloalaeditorComponent  implements OnInit, OnDestroy,  MatFormFieldControl<any>   {
  public visible = false;
  public visibleAnimate = false;


  private subscriptions: Subscription[] = [];


  public options: any;
  childData : string = " this is the string";

  @Input() formControlName: any;
  @Input() toggleedit: any;
  @Input() hidebutton: any;
  @Input() componentid: any;
  selectedComponentId: string;

  @Output() contentanswer = new EventEmitter();

  // @ts-ignore
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
  @Output() paigeContents: any  = new EventEmitter<any>();


  constructor() { }
  value: any;
  stateChanges: Observable<void>;
  id: string;
  placeholder: string;
  ngControl: AbstractControlDirective | NgControl;
  focused: boolean;
  empty: boolean;
  shouldLabelFloat: boolean;
  required: boolean;
  disabled: boolean;
  errorState: boolean;
  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;
  setDescribedByIds(ids: string[]): void {
    throw new Error("Method not implemented.");
  }
  onContainerClick(event: MouseEvent): void {
    throw new Error("Method not implemented.");
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
    FroalaEditor.DefineIcon("insert_template" + this.componentid, { NAME: "plus", SVG_KEY: "add" });
    FroalaEditor.RegisterCommand("insert_template" + this.componentid, {
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

    this.options = {
      zIndex:2501,
      quickInsertEnabled: false,
      attribution: false,
      imageUploadURL:  "https://pav.compute.inspirze.com/api/s3froalaimage",
      videoUploadURL:  "https://pav.compute.inspirze.com/api/s3froalavideo",
      fileUploadURL:  "https://pav.compute.inspirze.com/api/s3froalafile",
      charCounterCount: true,
      toolbarButtons: {
        // Key represents the more button from the toolbar.
        moreText: {
          // List of buttons used in the group.
          buttons: ["bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily", "fontSize", "textColor", "backgroundColor", "inlineClass", "inlineStyle", "clearFormatting"],

          // Alignment of the group in the toolbar.
          align: "left",

          // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
          buttonsVisible: 3,
        },
        moreParagraph: {
          buttons: ["alignLeft", "alignCenter", "formatOLSimple", "alignRight", "alignJustify", "formatOL", "formatUL", "paragraphFormat", "paragraphStyle", "lineHeight", "outdent", "indent", "quote"],
          align: "left",
          buttonsVisible: 3,
        },
        moreRich: {
          buttons: ["insertLink", "insertImage", "insertVideo", "insert_template" + this.componentid, "insertTable", "emoticons", "fontAwesome", "specialCharacters", "embedly", "insertFile", "insertHR"],
          align: "left",
          buttonsVisible: 4,
        },
        moreMisc: {
          buttons: ["undo", "redo", "fullscreen", "print", "getPDF", "spellChecker", "selectAll", "html", "help"],
          align: "right",
          buttonsVisible: 2,
        },
      },
    };

    setTimeout(() => {
      this.updateSections();
    }, 1000);

    // }))
  }

  changeContent(content) {
    this.updateSections();
    this.contentanswer.emit(content);
  }

  focusEditor() {
    $("#mymaineditor").froalaEditor("events.focus", true);
  }

  emptyContent() {
    $("#mymaineditor").froalaEditor("html.set", "");
  }

  toggleEdit() {
    this.toggleedit = !this.toggleedit;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((elem) => {
      elem.unsubscribe();
    });
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
      this.formControlName += e.data.message;
      this.contentanswer.emit(this.formControlName);
      $("#selection_box").hide();
      setTimeout(() => {
        this.updateSections();
      }, 1000);
    }
    this.selectedComponentId = "";
  }

  updateSections() {

  }

}
