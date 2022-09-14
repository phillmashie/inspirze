import { Subject, Subscription } from "rxjs";
import { Component, EventEmitter, Output, ViewEncapsulation, Input, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, HostBinding, Injector } from "@angular/core";
import FroalaEditor from "froala-editor";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { FocusMonitor } from "@angular/cdk/a11y";
declare var $: any;
// declare var FroalaEditor: any;


@Component({
  selector: 'app-floalaeditor',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './floalaeditor.component.html',
  styleUrls: ['./floalaeditor.component.css']
})
export class FloalaeditorComponent implements OnInit, OnDestroy  {
  public visible = false;
  public visibleAnimate = false;
  static nextId = 0;

private subscriptions: Subscription[] = [];

public options: Object;

@Input() content: string;
@Input() toggleedit: boolean;
@Input() hidebutton: boolean;
@Input() componentid: string;

@HostBinding() id = `app-floalaeditor-${FloalaeditorComponent.nextId++}`;
@ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;

@Output() contentanswer = new EventEmitter();

stateChanges = new Subject<void>();

FroalaEditor: any = FroalaEditor;
editor: any;
controlType = 'app-floalaeditor';
errorState = false;
ngControl: any;
touched = false;
focused = false;


  constructor(public elRef: ElementRef, public injector: Injector, public fm: FocusMonitor) {
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }
  ngOnInit(): void {
    // avoid Cyclic Dependency
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; }

    const editorRef = this.container.nativeElement.querySelector('.editor');
    const options = this.options || this.options;
    FroalaEditor.DefineIcon("insert_template", { NAME: "plus", SVG_KEY: "add" });
    FroalaEditor.RegisterCommand("insert_template", {
    title: "Insert Template Content",
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    showOnMobile: false,
    callback: () => {
    if ($("#mymaineditor" + (this.componentid ? this.componentid : "")).hasClass("fr-fullscreen")) {
    $("#selection_box").css("padding-left", "0px");
    } else {
    $("#selection_box").css("padding-left", "0px");
    }

    $("#selection_box").show();
    },
    });

    this.options = {
      quickInsertEnabled: false,
      attribution: false,
      // videoUploadToS3: s3tokenkey,
      // imageUploadToS3: s3tokenkey,
      // fileUploadToS3: s3tokenkey,
      imageUploadURL: "https://pav.compute.inspirze.com/api/s3froalaimage",
      videoUploadURL: "https://pav.compute.inspirze.com/api/s3froalavideo",
      fileUploadURL: "https://pav.compute.inspirze.com/api/s3froalafile",
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
      buttons: ["insertLink", "insertImage", "insertVideo", "insert_template", "insertTable", "emoticons", "fontAwesome", "specialCharacters", "embedly", "insertFile", "insertHR"],
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

      updateSections() {
      $(".tempbutton").remove();

      $("body")
      .find("section")
      .each((index, section) => {
      if (index == 0) {
      $(section).before(
      `<div class="tempbutton">
      <div id="deleteSection` +
      index +
      `" class="tempbuttonsingleright">
      <i class="material-icons">
      delete
      </i>
      </div>
      </div>`
      );
      } else {
      $(section).before(
      `<div class="tempbutton">
      <div id="moveSection` +
      index +
      `" class="tempbuttonsingle">
      <i class="material-icons">
      keyboard_arrow_up
      </i>
      </div>
      <div id="deleteSection` +
      index +
      `" class="tempbuttonsingleright">
      <i class="material-icons">
      delete
      </i>
      </div>
      </div>`
      );
      }

      $(`#moveSection` + index).click((event) => {
      var elementbottom = $(event.currentTarget).parent().nextAll("section").first();
      var elementtop = $(event.currentTarget).parent().prevAll("section").first();
      elementtop.before(elementbottom);
      this.updateSections();
      });

      $(`#deleteSection` + index).click((event) => {
      $(event.currentTarget).parent().nextAll("section").first().remove();
      this.updateSections();
      });
      });

      $("body")
      .find("footer")
      .each((index, footer) => {
      $(footer).before(
      `<div class="tempbutton">
      <div id="deleteFooter` +
      index +
      `" class="tempbuttonsingleright">
      <i class="material-icons">
      delete
      </i>
      </div>
      </div>`
      );

      $(`#deleteFooter` + index).click((event) => {
      $(event.currentTarget).parent().nextAll("footer").first().remove();
      this.updateSections();
      });
      });
      }
      }





   
