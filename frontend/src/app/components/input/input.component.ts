import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'input-component',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() width: number = 150;
  @Input() height: number = 23;
  @Input() paddingLeft: number = 10;
  @Input() model: any;
  @Input() type: string = 'number';
  @Output() changes = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  changeMade() {
    this.changes.emit(this.model);
  }
}
