// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

@Injectable()
export class EpisodeOfCareService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  public list(patientId: string, startDate: Date, endDate: Date): Observable<any[]> {
    return this.get(`/api/EpisodeOfCare/List?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      return json;
    });
  }
}
