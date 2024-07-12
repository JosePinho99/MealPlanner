import { Component, Input, OnInit } from '@angular/core';

export enum ButtonType {
  Main = 'main',
  Secondary = 'secondary',
  Tertiary = 'tertiary'
}

@Component({
  selector: 'button-component',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  buttonTypes = ButtonType;

  @Input() title: string = 'Button title';
  @Input() type = 'main';
  @Input() size = 'medium';

  constructor() { }

  ngOnInit(): void {
  }

}
