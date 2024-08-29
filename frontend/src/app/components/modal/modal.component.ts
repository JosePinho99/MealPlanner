import {Component, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'modal-component',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string;
  @Input() width: string;
  @Input() height: string;
}
