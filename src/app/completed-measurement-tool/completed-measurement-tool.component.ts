// Imports
import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

// Imports models
import { CompletedMeasurementTool } from './../entity-views/completed-measurement-tool.model';

@Component({
  selector: 'app-completed-measurement-tool',
  templateUrl: './completed-measurement-tool.component.html',
  styleUrls: ['./completed-measurement-tool.component.css']
})
export class CompletedMeasurementToolComponent implements OnChanges {

  public radarChartLabels: string[] = [];

  public radarChartData: Array<{ data: number[], label: string }> = [];

  public options: any = {
    responsive: true,
    scale: {
      ticks: {
        min: 0,
        max: 7
      }
    }
  };

  public colors: any = [
    {
      backgroundColor: "rgba(0, 100, 0, 0.4)"
    },
    {
      backgroundColor: "rgba(65, 105, 225, 0.4)"
    },
    {
      backgroundColor: "rgba(178, 34, 34, 0.4)"
    }];


  public radarChartType: string = 'radar';

  public isInitialized = false;

  @Input()
  public data: CompletedMeasurementTool[] = null;

  @Input()
  public name: string = null;

  constructor() { }

  public ngOnInit() {

  }

  public ngOnChanges(changes: any) {

    if (!this.data) {
      return;
    }

    let tempData = this.data
      .sort((a: CompletedMeasurementTool, b: CompletedMeasurementTool) => {
        return a.endDate > b.endDate ? 1 : 0;
      });

    if (tempData.length === 0) {
      return;
    }

    if (tempData.length > 3) {
      tempData = tempData.slice(-3);
    }

    this.radarChartLabels = Object.keys(tempData[0].scoreItems);
    this.radarChartData = tempData
      .map((x, i) => {
        return {
          data: Object.keys(x.scoreItems).map((key) => x.scoreItems[key]),
          label: `${moment(x.endDate).format('YYYY-MM-DD')}`
        };
      });

    this.isInitialized = true;
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
