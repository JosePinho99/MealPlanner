import {Component, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'loading-component',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() top: string = '50%';
  @Input() spinnerSize: string = '48px';
  @Input() left: string = '50%';
  @Input() label = null;
}
