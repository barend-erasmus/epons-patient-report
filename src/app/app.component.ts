// Imports
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ElementRef, Input } from '@angular/core';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

// Imports services
import { PatientService } from './services/patient.service';
import { VisitService } from './services/visit.service';
import { EpisodeOfCareService } from './services/episode-of-care.service';
import { FacilityService } from './services/facility.service';


@Component({
  selector: 'epons-patient-report',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private patientService: PatientService = null;
  private episodeOfCareService: EpisodeOfCareService = null;
  private visitService: VisitService = null;
  private facilityService: FacilityService = null;

  public patient: any = null;

  public facility: any = null;

  public episodeOfCares: any[] = [];
  public diagnoses: any[] = [];
  public treatingDoctors: any = [];
  public referringDoctors: any[] = [];

  public visits: any[] = [];
  public caseManagerNotes: any[] = [];
  public dailyClinicalNotes: any[] = [];

  public charts: Array<{ name: string, data: any[] }> = [];

  public startDate: Date = moment().subtract(365, 'days').toDate();
  public endDate: Date = moment().toDate();

  public busyDownloading: boolean = false;

  public patientId: string = null;
  public facilityId: string = null;

  public showRadarChart: boolean = null;
  public showLineChart: boolean = null;
  public showDailyClinicalNotes: boolean = null;
  public showCaseManagerNotes: boolean = null;

  constructor(private http: Http, private el: ElementRef) {
    this.patientService = new PatientService(http);
    this.episodeOfCareService = new EpisodeOfCareService(http);
    this.visitService = new VisitService(http);
    this.facilityService = new FacilityService(http);

  }

  ngOnInit(): void {

    this.patientId = this.el.nativeElement.getAttribute('patientId');
    this.facilityId = this.el.nativeElement.getAttribute('facilityId');
    this.startDate = moment(this.el.nativeElement.getAttribute('startDate')).toDate();
    this.endDate = moment(this.el.nativeElement.getAttribute('endDate')).toDate();
    this.showRadarChart = this.el.nativeElement.getAttribute('showRadarChart').toLowerCase() === 'true';
    this.showLineChart = this.el.nativeElement.getAttribute('showLineChart').toLowerCase() === 'true';
    this.showDailyClinicalNotes = this.el.nativeElement.getAttribute('showDailyClinicalNotes').toLowerCase() === 'true';
    this.showCaseManagerNotes = this.el.nativeElement.getAttribute('showCaseManagerNotes').toLowerCase() === 'true';

    this.loadCompletedMeasurementTools(this.patientId);
    this.loadPatient(this.patientId);
    this.loadVisits(this.patientId);
    this.loadEpisodeOfCares(this.patientId);

    this.loadFacility(this.facilityId);
  }

  public download(): void {
    const canvasElements: any[] = this.el.nativeElement.querySelectorAll('canvas');

    const charts: any = {};

    for (const cv of canvasElements) {
      const name = cv.attributes['id'].value.split('-')[0];
      const type = cv.attributes['id'].value.split('-')[1];

      if (!charts[name]) {
        charts[name] = {};
      }

      charts[name][type] = cv.toDataURL();
    }

    this.export(charts);
  }

  private loadFacility(facilityId: string): void {
    this.facilityService.find(facilityId).subscribe((result) => {
      this.facility = result;
    })
  }

  private loadPatient(patientId: string): void {
    this.patientService.findById(patientId).subscribe((result: any) => {
      this.patient = result;
    });
  }

  private loadCompletedMeasurementTools(patientId: string): void {
    this.visitService.listCompletedMeasurementTools(patientId, this.startDate, this.endDate).subscribe((result: any[]) => {

      const measurementTools: string[] = result.map((x) => x.MeasurementTool.Name).filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      measurementTools.forEach((name) => {
        const data = result
          .filter((x) => x.MeasurementTool.Name === name);

        this.charts.push({
          name: name,
          data: data
        });
      });
    });
  }

  private loadVisits(patientId: string): void {
    this.visitService.list(patientId, this.startDate, this.endDate).subscribe((result: any[]) => {
      this.visits = result;
      this.caseManagerNotes = result;
      this.dailyClinicalNotes = result;

      this.caseManagerNotes = this.caseManagerNotes.filter((visit) => {
        const note = visit.ProgressNotes ? visit.ProgressNotes.replace(/<(?:.|\n)*?>/gm, '') : null;

        return note ? true : false;
      });

      this.dailyClinicalNotes = this.dailyClinicalNotes.filter((visit) => {
        const note = visit.DailyNotes ? visit.DailyNotes.replace(/<(?:.|\n)*?>/gm, '') : null;

        return note ? true : false;
      });
    });
  }

  private loadEpisodeOfCares(patientId: string): void {
    this.episodeOfCareService.list(patientId, this.startDate, this.endDate).subscribe((result: any[]) => {
      this.episodeOfCares = result;
      this.diagnoses = result.filter((x) => x.Diagnoses).map((x) => x.Diagnoses).filter((x, index, self) => self.findIndex((y) => { return y.Id === x.Id }) === index);
      this.treatingDoctors = result.filter((x) => x.TreatingDoctor).map((x) => x.TreatingDoctor);
      this.referringDoctors = result.filter((x) => x.ReferringDoctor).map((x) => x.ReferringDoctor);
    });
  }

  private getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  private export(charts: any): void {
    this.busyDownloading = true;

    this.http.post(`http://epons.openservices.co.za/epons-patient-report-service`, {
    // this.http.post(`http://localhost:3000/epons-patient-report-service`, {
      charts,
      patientId: this.patientId,
      facilityId: this.facilityId,
      startDate: this.startDate,
      endDate: this.endDate,
      showDailyClinicalNotes: this.showDailyClinicalNotes,
      showCaseManagerNotes: this.showCaseManagerNotes,
    }, { responseType: ResponseContentType.Blob })
      .map(res => res.blob())
      .subscribe(data2 => {
        FileSaver.saveAs(data2, `${this.showCaseManagerNotes? 'PPR' : 'Daily_Notes'}_${this.patient.Firstname}_${this.patient.Lastname}.pdf`);
        this.busyDownloading = false;
      });
  }
}
