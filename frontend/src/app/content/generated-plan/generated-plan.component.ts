import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GeneratedPlan} from "../../../../../commons/interfaces";

@Component({
  selector: 'app-generated-plan',
  templateUrl: './generated-plan.component.html',
  styleUrls: ['./generated-plan.component.scss']
})
export class GeneratedPlanComponent implements OnInit, OnChanges {

  @Input() plan: GeneratedPlan;


  teste: string;
  constructor() { }

  ngOnInit(): void {}

  ngOnChanges() {
    this.teste = JSON.stringify(this.plan);
  }

}
