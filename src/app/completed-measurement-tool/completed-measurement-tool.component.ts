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
  public lineChartLabels: string[] = [];

  public radarChartData: Array<{ data: number[], label: string }> = [];
  public lineChartData: Array<{ data: number[], label: string }> = [];

  public radarChartOptions: any = {
    responsive: true,
    scale: {
      ticks: {
        min: 0,
        max: 7,
      }
    }
  };

  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        fill: false
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
  public lineChartType: string = 'line';

  public isInitialized = false;

  @Input()
  public data: any[] = null;

  @Input()
  public name: string = null;

  @Input()
  public showRadarChart: boolean = null;

  @Input()
  public showLineChart: boolean = null;

  constructor() { }

  public ngOnInit() {

  }

  public ngOnChanges(changes: any) {

    if (!this.data) {
      return;
    }

    let radarTempData = this.data
      .sort((a: any, b: any) => {
        return a.EndDate > b.EndDate ? 1 : 0;
      });

    let lineTempData = this.data
      .sort((a: any, b: any) => {
        return a.EndDate > b.EndDate ? 1 : 0;
      });

    if (radarTempData.length === 0) {
      return;
    }

    if (radarTempData.length > 3) {
      radarTempData = radarTempData.slice(-3);
    }

    this.radarChartLabels = Object.keys(radarTempData[0].ScoreItems).map((x) => this.wordWrap(x));
    this.lineChartLabels = lineTempData.map((x) => moment(x.EndDate).format('YYYY-MM-DD'));

    this.radarChartData = radarTempData
      .map((x, i) => {
        return {
          data: Object.keys(x.ScoreItems).map((key) => x.ScoreItems[key]),
          label: this.name === 'Beta' ?
            `${moment(x.EndDate).format('YYYY-MM-DD')}:   ${x.Score}   (${x.BurdenOfCare} hours per 24 hours)` :
            `${moment(x.EndDate).format('YYYY-MM-DD')}:   ${x.Score}`
        };
      });

    for (const key in lineTempData[0].ScoreItems) {
      this.lineChartData.push({
        data: lineTempData.map((x) => x.ScoreItems[key]),
        label: key
      });
    }

    if (this.name === 'APOM') {
      this.radarChartOptions.scale.ticks.max = 18;
    } else {
      this.radarChartOptions.scale.ticks.max = 7;
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

    while (workingStr.length > 20) {
      newStr.push(workingStr.slice(0, 20));
      workingStr = workingStr.slice(20)
    }

    newStr.push(workingStr);

    return newStr;
  }
}
