// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

// Imports models
import { EpisodeOfCare } from './../entity-views/episode-of-care.model';
import { Facility } from './../value-objects/facility.model';

@Injectable()
export class EpisodeOfCareService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  public list(patientId: string): Observable<EpisodeOfCare[]> {
    return this.get(`/api/EpisodeOfCare/List?patientId=${patientId}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new EpisodeOfCare(
          new Facility(x.Facility.Id, x.Facility.Name),
          x.uniqueHospitalNumber,
          moment(x.AdmissionTimestamp).toDate(),
          moment(x.DischargeTimestamp).toDate(),
          null,
          null
      ));

      return result;
    });
  }

}
