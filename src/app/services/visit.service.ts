// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

@Injectable()
export class VisitService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  public list(patientId: string, startDate: Date, endDate: Date): Observable<any[]> {
    return this.get(`/api/Visit/List?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      return json;
    });
  }

  public listCompletedMeasurementTools(patientId: string, startDate: Date, endDate: Date): Observable<any[]> {
    return this.get(`/api/Visit/ListCompletedMeasurementTools?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      for (const item of json) {
        item.StartDate = new Date(item.StartDate.split('T').join(' '));
        item.EndDate = new Date(item.EndDate.split('T').join(' '));
      }

      console.log(json);

      return json;
    });
  }

}
