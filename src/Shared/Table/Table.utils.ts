export interface TableColumn {
  property: string,
  type:ColumnType,
  header: string,
  style: any
}

export enum ColumnType {
  TEXT,
  LIST
}