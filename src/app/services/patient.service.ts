// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

@Injectable()
export class PatientService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  public findById(patientId: string): Observable<any> {
    return this.get(`/api/Patient/FindById?id=${patientId}`).map((x) => {

      const json: any = x.json();

      return json;
    });
  }
}
