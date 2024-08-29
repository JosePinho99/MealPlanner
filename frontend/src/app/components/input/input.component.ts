import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';


@Component({
  selector: 'input-component',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements AfterViewInit {
  @ViewChild('input') inputElement: ElementRef;
  @Input() width: number = 150;
  @Input() height: number = 23;
  @Input() paddingLeft: number = 5;
  @Input() fontSize: string = '1rem';
  @Input() model: any;
  @Input() type: string = 'number';
  @Input() placeholder: string;
  @Input() focus: boolean = false;
  @Output() changes = new EventEmitter();

  constructor() { }

  ngAfterViewInit() {
    if (this.focus) {
      this.inputElement.nativeElement.focus();
    }
  }

  changeMade() {
    this.changes.emit(this.model);
  }
}
