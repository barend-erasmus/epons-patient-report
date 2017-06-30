// Imports
import { Headers, Http, Response } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

// Imports services
import { PatientService } from './services/patient.service';

// Imports models
import { CompletedMeasurementTool } from './entity-views/completed-measurement-tool.model';
import { Patient } from './entities/patient.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private patientService: PatientService = null;

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

  public isInitialized: boolean = false;

  public title: string = '';
  public patient: Patient = null;

  constructor(http: Http) {
    this.patientService = new PatientService(http);
    const patientId = this.getParameterByName('id');
    const measurementToolName = this.getParameterByName('name');

    this.loadCompletedMeasurementTools(patientId, measurementToolName);
    this.loadPatient(patientId, measurementToolName);
  }

  private loadPatient(patientId: string, measurementToolName: string): void {
    this.patientService.findById(patientId).subscribe((result: Patient) => {
      this.patient = result;
      this.title = `${this.patient.firstname} ${this.patient.lastname} - ${measurementToolName}`;
    });
  }

  private loadCompletedMeasurementTools(patientId: string, measurementToolName: string): void {
    this.patientService.listCompletedMeasurementTools(patientId, moment().subtract(365, 'days').toDate(), moment().toDate()).subscribe((result: CompletedMeasurementTool[]) => {

      result = result
        .filter((x) => x.measurementTool.name === measurementToolName)
        .sort((a: CompletedMeasurementTool, b: CompletedMeasurementTool) => {
          return a.endDate > b.endDate ? 1 : 0;
        });

      if (result.length === 0) {
        return;
      }

      if (result.length > 3) {
          result = result.slice(-3);
      }

      this.radarChartLabels = Object.keys(result[0].scoreItems);
      this.radarChartData = result
        .map((x, i) => {
          return {
            data: Object.keys(x.scoreItems).map((key) => x.scoreItems[key]),
            label: `${moment(x.startDate).format('YYYY-MM-DD')} - ${moment(x.endDate).format('YYYY-MM-DD')}`
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

  private getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
