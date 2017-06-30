// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

// Imports models
import { CompletedMeasurementTool } from './../entity-views/completed-measurement-tool.model';
import { MeasurementTool } from './../value-objects/measurement-tool.model';

@Injectable()
export class PatientService extends BaseService {

  constructor(http: Http) { 
    super(http);
  }

  public listCompletedMeasurementTools(patientId: string, startDate: Date, endDate: Date): Observable<CompletedMeasurementTool[]> {
    return this.get(`/api/Patient/ListCompletedMeasurementTools?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new CompletedMeasurementTool(new MeasurementTool(x.MeasurementTool.Id, x.MeasurementTool.Name), moment(x.StartDate).toDate(), moment(x.EndDate).toDate(), x.ScoreItems))

      return result;
    });
  }

}
