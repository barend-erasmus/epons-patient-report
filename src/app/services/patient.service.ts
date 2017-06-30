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
import { MeasurementTool } from './../value-objects/measurement-tool.model';
import { Patient } from './../entities/patient.model';
import { PatientAddress } from './../models/patient-address.model';
import { Country } from './../value-objects/country.model';
import { City } from './../value-objects/city.model';
import { Province } from './../value-objects/province.model';

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
      ));

      return result;
    });
  }

  public listCompletedMeasurementTools(patientId: string, startDate: Date, endDate: Date): Observable<CompletedMeasurementTool[]> {
    return this.get(`/api/Patient/ListCompletedMeasurementTools?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new CompletedMeasurementTool(new MeasurementTool(x.MeasurementTool.Id, x.MeasurementTool.Name), moment(x.StartDate).toDate(), moment(x.EndDate).toDate(), x.ScoreItems));

      return result;
    });
  }

}
