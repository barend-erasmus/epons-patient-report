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

  public patient: Patient = null;

  public charts: Array<{ name: string, data: CompletedMeasurementTool[] }> = [];

  public startDate: Date = moment().subtract(365, 'days').toDate();
  public endDate: Date = moment().toDate();

  constructor(http: Http) {
    this.patientService = new PatientService(http);
    const patientId = this.getParameterByName('id');

    this.loadCompletedMeasurementTools(patientId);
    this.loadPatient(patientId);
  }

  private loadPatient(patientId: string): void {
    this.patientService.findById(patientId).subscribe((result: Patient) => {
      this.patient = result;
    });
  }

  private loadCompletedMeasurementTools(patientId: string): void {
    this.patientService.listCompletedMeasurementTools(patientId, this.startDate, this.endDate).subscribe((result: CompletedMeasurementTool[]) => {

      const measurementTools: string[] = result.map((x) => x.measurementTool.name).filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      measurementTools.forEach((name) => {
        const data = result
          .filter((x) => x.measurementTool.name === name);

        this.charts.push({
          name: name,
          data: data
        });
      });
    });
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
