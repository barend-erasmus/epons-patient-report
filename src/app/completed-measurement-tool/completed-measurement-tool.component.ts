// Imports
import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-completed-measurement-tool',
  templateUrl: './completed-measurement-tool.component.html',
  styleUrls: ['./completed-measurement-tool.component.css']
})
export class CompletedMeasurementToolComponent implements OnChanges {

  public radarChartLabels: string[][] = [];

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
  public data: any[] = null;

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
      .sort((a: any, b: any) => {
        return a.EndDate > b.EndDate ? 1 : 0;
      });

    if (tempData.length === 0) {
      return;
    }

    if (tempData.length > 3) {
      tempData = tempData.slice(-3);
    }

    this.radarChartLabels = Object.keys(tempData[0].ScoreItems).map((x) => this.wordWrap(x));
    this.radarChartData = tempData
      .map((x, i) => {
        return {
          data: Object.keys(x.ScoreItems).map((key) => x.ScoreItems[key]),
          label: `${moment(x.EndDate).format('YYYY-MM-DD')}`
        };
      });

    if (this.name === 'APOM') {
      this.options.scale.ticks.max = 18;
    } else {
      this.options.scale.ticks.max = 7;
    }

    this.isInitialized = true;
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  private wordWrap(str: string): string[] {

    let workingStr = str;
    const newStr = [];

    while(workingStr.length > 20) {
      newStr.push(workingStr.slice(0, 20));
      workingStr = workingStr.slice(20)
    }

    newStr.push(workingStr);

    return newStr;
  }
}
