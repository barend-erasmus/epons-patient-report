// Imports
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

// Imports services
import { PatientService } from './services/patient.service';
import { VisitService } from './services/visit.service';
import { EpisodeOfCareService } from './services/episodeOfCare.service';

// Imports models
import { CompletedMeasurementTool } from './entity-views/completed-measurement-tool.model';
import { Visit } from './entity-views/visit.model';
import { PatientMeasurementTool } from './entity-views/patient-measurement-tool.model';
import { Patient } from './entities/patient.model';
import { Doctor } from './entity-views/doctor.model';
import { Diagnoses } from './value-objects/diagnoses.model';
import { EpisodeOfCare } from './entity-views/episode-of-care.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private patientService: PatientService = null;
  private episodeOfCareService: EpisodeOfCareService = null;
  private visitService: VisitService = null;

  public patient: Patient = null;
  public episodeOfCares: EpisodeOfCare[] = [];
  public diagnoses: Diagnoses[] = [];
  public visits: Visit[] = [];
  public referringDoctors: Doctor[] = [];
  public treatingDoctors: Doctor[] = [];
  public measurementTools: PatientMeasurementTool[] = [];

  public charts: Array<{ name: string, data: CompletedMeasurementTool[] }> = [];

  public startDate: Date = moment().subtract(365, 'days').toDate();
  public endDate: Date = moment().toDate();

  public busyDownloading: boolean = false;

  constructor(private http: Http, private el: ElementRef) {
    this.patientService = new PatientService(http);
    this.episodeOfCareService = new EpisodeOfCareService(http);
    this.visitService = new VisitService(http);
    const patientId = this.getParameterByName('id');

    this.loadCompletedMeasurementTools(patientId);
    this.loadPatient(patientId);
    this.loadVisits(patientId);
    this.loadEpisodeOfCares(patientId);
    this.loadReferringDoctors(patientId);
    this.loadTreatingDoctors(patientId);
    this.loadDiagnoses(patientId);
    this.loadMeasurementTools(patientId);
  }

  public download(): void {
    const canvasElements = this.el.nativeElement.querySelectorAll('canvas');

    let html: string = this.el.nativeElement.innerHTML;

    html = html.replace(/<button[^>]*name="download"[^>]*>(.*?)<\/button>/, '');

    for (const cv of canvasElements) {
      html = html.replace(/<canvas[^>]*>([.|\n]*?)<\/canvas>/, `<img src="${cv.toDataURL()}"></img>`);
    }

    this.export(html);
  }

  private loadPatient(patientId: string): void {
    this.patientService.findById(patientId).subscribe((result: Patient) => {
      this.patient = result;
    });
  }

  private loadCompletedMeasurementTools(patientId: string): void {
    this.visitService.listCompletedMeasurementTools(patientId, this.startDate, this.endDate).subscribe((result: CompletedMeasurementTool[]) => {

      const measurementTools: string[] = result.map((x) => x.measurementTool.name).filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      measurementTools.forEach((name) => {
        const data = result
          .filter((x) => x.measurementTool.name === name);

        this.charts.push({
          name: name,
          data: data
        });
      });
    });
  }

  private loadVisits(patientId: string): void {
    this.visitService.list(patientId, this.startDate, this.endDate).subscribe((result: Visit[]) => {
      this.visits = result;
    });
  }

  private loadEpisodeOfCares(patientId: string): void {
    this.episodeOfCareService.list(patientId).subscribe((result: EpisodeOfCare[]) => {
      this.episodeOfCares = result;
    });
  }

  private loadMeasurementTools(patientId: string): void {
    this.patientService.listMeasurementTools(patientId).subscribe((result: PatientMeasurementTool[]) => {
      this.measurementTools = result;
    });
  }

  private loadDiagnoses(patientId: string): void {
    this.episodeOfCareService.listDiagnoses(patientId).subscribe((result: Diagnoses[]) => {
      this.diagnoses = result;
    });
  }

  private loadReferringDoctors(patientId: string): void {
    this.episodeOfCareService.listReferringDoctors(patientId).subscribe((result: Doctor[]) => {
      this.referringDoctors = result;
    });
  }

  private loadTreatingDoctors(patientId: string): void {
    this.episodeOfCareService.listTreatingDoctors(patientId).subscribe((result: Doctor[]) => {
      this.treatingDoctors = result;
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

  private export(html: string): void {
    this.busyDownloading = true;

    this.http.get(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`).map(res => res.text())
      .subscribe(data1 => {
        let pageStyle = `<style>${data1}</style>`;

        this.http.post(`https://html-converter.openservices.co.za/api/convert/topdf?`, {
          html: `${pageStyle}${html}`
        }, { responseType: ResponseContentType.Blob })
          .map(res => res.blob())
          .subscribe(data2 => {
            FileSaver.saveAs(data2, `PPR_${this.patient.firstname}_${this.patient.lastname}.pdf`);
            this.busyDownloading = false;
          });
      });
  }
}
