import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

export interface TableColumn {
  property: string,
  header: string,
  value?: (row: any) => string,
}

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

  constructor() { }

  ngOnInit(): void {
  }

  editClicked(data: any) {
    this.edit.emit(data);
  }

  deleteClicked(data: any) {
    this.delete.emit(data);
  }
}
