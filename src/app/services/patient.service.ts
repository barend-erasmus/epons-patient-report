// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

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

  public listCompletedMeasurementTools(): Observable<CompletedMeasurementTool[]> {
    return this.get('/api/Patient/ListCompletedMeasurementTools?patientId=5c4042d2-258e-416f-a421-873f9371e20c').map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new CompletedMeasurementTool(new MeasurementTool(x.MeasurementTool.id, x.MeasurementTool.name), x.StartDate, x.EndDate, x.ScoreItems))

      return result;
    });
  }

}
