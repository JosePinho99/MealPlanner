import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from "../button/button.module";

@Component({
  selector: 'modal-delete-component',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent {
  @Input() message: string
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  loading: boolean = false;


  confirm() {
    this.loading = true;
    this.delete.emit();
  }
}
