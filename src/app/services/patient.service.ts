// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

// Imports models
import { Patient } from './../entities/patient.model';
import { PatientMeasurementTool } from './../entity-views/patient-measurement-tool.model';
import { PatientAddress } from './../models/patient-address.model';
import { Country } from './../value-objects/country.model';
import { City } from './../value-objects/city.model';
import { Province } from './../value-objects/province.model';
import { MeasurementTool } from './../value-objects/measurement-tool.model';
import { Frequency } from './../value-objects/frequency.model';

@Injectable()
export class PatientService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  public findById(patientId: string): Observable<Patient> {
    return this.get(`/api/Patient/FindById?id=${patientId}`).map((x) => {

      const json: any = x.json();

      if (!json) {
        return null;
      }

      const result = new Patient(json.Id, json.Firstname, json.Lastname, json.IdentificationNumber, moment(json.DateOfBirth).toDate(), new PatientAddress(
        json.Address.Country ? new Country(json.Address.Country.Id, json.Address.Country.Name) : null,
        json.Address.Province ? new Province(json.Address.Province.Id, json.Address.Province.Name) : null,
        json.Address.City ? new City(json.Address.City.Id, json.Address.City.Name) : null,
        json.Address.Street,
        json.Address.PostalCode
      ), json.Avatar);

      return result;
    });
  }

  public listMeasurementTools(patientId: string): Observable<PatientMeasurementTool[]> {
    return this.get(`/api/Patient/ListMeasurementTools?id=${patientId}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new PatientMeasurementTool(
        moment(x.AssignedTimestamp).toDate(),
        x.DeassignedTimestamp ? moment(x.DeassignedTimestamp).toDate() : null,
        new MeasurementTool(x.MeasurementTool.Id, x.MeasurementTool.Name),
        new Frequency(x.Frequency.Id, x.Frequency.Name)
      ));

      return result;
    });
  }
}
