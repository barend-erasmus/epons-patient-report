// Imports
import { Headers, Http, Response } from '@angular/http';
import { Component, OnInit } from '@angular/core';

// Imports services
import { PatientService } from './services/patient.service';

// Imports models
import { CompletedMeasurementTool } from './entity-views/completed-measurement-tool.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private patientService: PatientService = null;

  // public radarChartLabels: string[] = [];

  // public radarChartData: Array<{ data: number[], label: string }> = [];

  public radarChartLabels:string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
 
  public radarChartData:any = [
    {data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
  ];

  public radarChartType: string = 'radar';

  public isInitialized: boolean = false;

  constructor(http: Http) {
    this.patientService = new PatientService(http);

    this.loadCompletedMeasurementTools();
  }

  private loadCompletedMeasurementTools(): void {
    this.patientService.listCompletedMeasurementTools().subscribe((result: CompletedMeasurementTool[]) => {

      result.forEach((x) => {
        console.log(x)
      })

      this.radarChartLabels = Object.keys(result[0].scoreItems);
      this.radarChartData = result.map((x) => {
        return {
          data: Object.keys(x.scoreItems).map((key) => x.scoreItems[key]),
          label: 'aa'
        };
      });

      this.isInitialized = true;
    });
  }





  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
