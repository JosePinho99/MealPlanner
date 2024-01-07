import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() width: number = 300;
  @Input() minWidth: number = 0;
  @Input() maxWidth: number = 2000;

  mouseX: number = 0;
  startingX: number = 0;
  startingWidth: number = 0;
  onDrag: boolean = false;

  @HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    if (this.onDrag) {
      this.width = this.startingWidth  + (this.mouseX - this.startingX);
      if (this.width < this.minWidth) {
        this.width = this.minWidth;
      }
      if (this.width > this.maxWidth) {
        this.width = this.maxWidth;
      }
      event.stopPropagation();
      event.preventDefault();
    }
  }

  @HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.onDrag = false;
  }

  constructor() { }

  ngOnInit(): void {
  }

  mouseDown() {
    this.onDrag = true;
    this.startingX = this.mouseX;
    this.startingWidth = this.width;
  }

  mouseUp() {
    this.onDrag = false;
  }

}
