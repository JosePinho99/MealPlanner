import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

export interface TableColumn {
  property: string,
  header: string,
  value?: (row: any) => string,
  sort?: (a, b) => any
}

export const STRING_SORT_FUNCTION = (a, b) => a.localeCompare(b)

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableColumns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() gridTemplateColumns: string;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  sortAttr: string = null;
  sortAscending = false;

  constructor() { }

  ngOnInit(): void {
  }

  editClicked(data: any) {
    this.edit.emit(data);
  }

  deleteClicked(data: any) {
    this.delete.emit(data);
  }

  sort(column: TableColumn, ascending: boolean) {
    this.sortAttr = column.property;
    this.sortAscending = ascending;
    this.data = this.data.sort((a, b) => {
      const aValue = column?.value ? column.value(a) : a[column.property];
      const bValue = column?.value ? column.value(b) : b[column.property];
      if (ascending) {
        return column.sort(aValue, bValue);
      }  else {
        return column.sort(bValue, aValue);
      }
    });
  }
}
