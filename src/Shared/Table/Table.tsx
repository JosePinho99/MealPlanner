import React, { useEffect } from 'react';
import { useState } from 'react';
import './Table.css';
import { ColumnType, TableColumn } from './Table.utils';


function Table(props: any) {
  
  function populateColumns() {
    let jsxColumns: any[] = [];
    for (let column of props.columns) {
      jsxColumns.push(<div className='table-header-cell' style={column.style} key={column.header}>{column.header}</div>)
    }
    return jsxColumns;
  }

  function populateData() {
    let jsxRows: any[] = [];
    let index = 0;
    for (let row of props.data) {
      let rowCells: any[] = [];
      for (let column of props.columns) {
        rowCells.push(<div className='table-content-cell' style={column.style} key={row[column.property]}>{row[column.property]}</div>)
      }
      let jsxRow = <div className='table-content-row' key={index}>{rowCells}</div>;
      jsxRows.push(jsxRow);
      index += 1;
    }
    return jsxRows;
  }

  return (
    <div className="table-container">
      <div className='table-header'>
        {populateColumns()}
      </div>

      <div className='table-content'>
        {populateData()}
      </div>
    </div>
  );
}

export default Table;
