// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

// Imports models
import { CompletedMeasurementTool } from './../entity-views/completed-measurement-tool.model';
import { Visit } from './../entity-views/visit.model';
import { MeasurementTool } from './../value-objects/measurement-tool.model';
import { VitalSigns } from './../value-objects/vital-signs.model';

@Injectable()
export class VisitService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  public list(patientId: string, startDate: Date, endDate: Date): Observable<Visit[]> {
    return this.get(`/api/Visit/List?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new Visit(moment(x.Timestamp).toDate(),
        new VitalSigns(x.VitalSigns.Temperature === 0 ? null : x.VitalSigns.Temperature,
          x.VitalSigns.HeartRate === 0 ? null : x.VitalSigns.HeartRate,
          x.VitalSigns.BloodPressureSystolic === 0 ? null : x.VitalSigns.BloodPressureSystolic,
          x.VitalSigns.BloodPressureDiastolic === 0 ? null : x.VitalSigns.BloodPressureDiastolic,
          x.VitalSigns.RespiratoryRate === 0 ? null : x.VitalSigns.RespiratoryRate,
          x.VitalSigns.PulseOximetry === 0 ? null : x.VitalSigns.PulseOximetry,
          x.VitalSigns.Glucose === 0 ? null : x.VitalSigns.Glucose)));

      return result;
    });
  }

  public listCompletedMeasurementTools(patientId: string, startDate: Date, endDate: Date): Observable<CompletedMeasurementTool[]> {
    return this.get(`/api/Visit/ListCompletedMeasurementTools?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new CompletedMeasurementTool(new MeasurementTool(x.MeasurementTool.Id, x.MeasurementTool.Name), moment(x.StartDate).toDate(), moment(x.EndDate).toDate(), x.ScoreItems));

      return result;
    });
  }

}
