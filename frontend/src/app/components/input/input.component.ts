import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Validator} from "./input.types";


@Component({
  selector: 'input-component',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements AfterViewInit {
  @ViewChild('input') inputElement: ElementRef;
  @Input() width: number = 150;1
  @Input() height: number = 23;
  @Input() paddingLeft: number = 5;
  @Input() fontSize: string = '1rem';
  @Input() model: any;
  @Input() type: string = 'number';
  @Input() placeholder: string;
  @Input() focus: boolean = false;
  @Input() onlyInt: boolean = false;
  @Input() validators: Validator[];
  @Input() set forceValidate(activated: boolean) {
    if (activated) {
      this.validate();
    }
  };

  valid: boolean = true;
  errorMessage: string = '';

  @Output() changes = new EventEmitter();

  constructor() { }

  ngAfterViewInit() {
    if (this.focus) {
      this.inputElement.nativeElement.focus();
    }
  }

  changeMade() {
    this.validate();
    this.changes.emit(this.model);
  }

  validate() {
    this.valid = true;
    for (let validator of this.validators) {
      if (!validator.validationFunction(this.model)) {
        this.valid = false;
        this.errorMessage = validator.errorMessage;
        break;
      }
    }
  }
}
