import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  value: string;
  @Output() changes = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
  }

}
