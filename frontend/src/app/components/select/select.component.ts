import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'select-component',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  static numberOfElements = 0;
  id: string = '0';

  constructor(private elRef: ElementRef) { }

  @Input() selectedValue: string = '';
  @Input() selectedValues: string[] = [];
  @Input() values: string[] = ['rice', 'pasta', 'bread', 'potatoes'];
  @Input() width: number = 120;
  @Input() subSelects: string[] = [];    
  @Input() subSelectsValues: string[][] = [];    
  @Input() multipleSelect: boolean = false;  
  @Output() select = new EventEmitter();

  //Specify the items to display on the sub select
  specificSubSelectValues: string[] = [];
  subSelectToDisplay: string = '';

  

  @HostListener('document:mousedown', ['$event']) onMouseUp(event: MouseEvent) {
    const element = event.target as HTMLElement;
    if (!(element.classList.contains('header') && element.classList.contains(this.id))) {
      if (!(element.classList.contains('not-closable'))) {
        this.dropdownOpen = false;
      }
    } 
  }

  dropdownOpen: boolean = false;

  ngOnInit(): void {
    this.id = String(SelectComponent.numberOfElements);
    SelectComponent.numberOfElements += 1;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.subSelectToDisplay = '';
  }

  selectOption(value: string) {
    if (this.subSelects.length === 0 || !this.subSelects.includes(value)) {
      if (this.multipleSelect) {
        if (this.selectedValues.includes(value)) {
          let index = this.selectedValues.indexOf(value);
          this.selectedValues.splice(index, 1);
        } else {
          this.selectedValues.push(value);
        }
        this.select.emit(this.selectedValues);
      } else {
        this.selectedValue = value;
        this.dropdownOpen = false;
        this.select.emit(this.selectedValue);
      }
    }
  }

  hasSubSelect(value: string): any {
    if (this.subSelects.includes(value)) {
      let index = this.subSelects.indexOf(value);
      this.specificSubSelectValues = this.subSelectsValues[index];
      return true;
    }
    return false;
  }

  mouseHoverValue(value: string) {
    this.subSelectToDisplay = value;
  }

  mouseUnHoverValue(value: string) {
    this.subSelectToDisplay = '';
  }

  removeTag(tag: string) {
    let index = this.selectedValues.indexOf(tag);
    this.selectedValues.splice(index, 1);
  }
}
