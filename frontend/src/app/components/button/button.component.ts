import { Component, Input, OnInit } from '@angular/core';

export enum ButtonType {
  Main = 'main',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  Quaternary= 'quaternary'
}

@Component({
  selector: 'button-component',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  buttonTypes = ButtonType;

  @Input() title: string;
  @Input() type = 'main';
  @Input() size = 'medium';
  @Input() fillWidth: boolean = false;
  @Input() loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
