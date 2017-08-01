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
import { Doctor } from './../entity-views/doctor.model';
import { Facility } from './../value-objects/facility.model';
import { Diagnoses } from './../value-objects/diagnoses.model';
import { ImpairmentGroup } from './../value-objects/impairment-group.model';
import { DoctorContactDetails } from './../models/doctor-contact-details.model';

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
        x.DischargeTimestamp ? moment(x.DischargeTimestamp).toDate() : null,
        x.OnsetTimestamp ? moment(x.OnsetTimestamp).toDate() : null,
        x.Diagnoses === null ? null : new Diagnoses(x.Diagnoses.Id, x.Diagnoses.Name),
        x.ImpairmentGroup === null ? null : new ImpairmentGroup(x.ImpairmentGroup.Id, x.ImpairmentGroup.Name),
        null,
        null
      ));

      return result;
    });
  }

  public listReferringDoctors(patientId: string): Observable<Doctor[]> {
    return this.get(`/api/EpisodeOfCare/ListReferringDoctors?patientId=${patientId}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new Doctor(
        x.Fullname,
        new DoctorContactDetails(x.ContactDetails.EmailAddress, x.ContactDetails.ContactNumber),
        x.HPCSANumber,
        x.PracticeNumber
      ));

      return result;
    });
  }

  public listTreatingDoctors(patientId: string): Observable<Doctor[]> {
    return this.get(`/api/EpisodeOfCare/ListTreatingDoctors?patientId=${patientId}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new Doctor(
        x.Fullname,
        new DoctorContactDetails(x.ContactDetails.EmailAddress, x.ContactDetails.ContactNumber),
        x.HPCSANumber,
        x.PracticeNumber
      ));

      return result;
    });
  }

}
