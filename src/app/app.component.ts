// Imports
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

// Imports services
import { PatientService } from './services/patient.service';
import { VisitService } from './services/visit.service';
import { EpisodeOfCareService } from './services/episode-of-care.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private patientService: PatientService = null;
  private episodeOfCareService: EpisodeOfCareService = null;
  private visitService: VisitService = null;

  public patient: any = null;

  public episodeOfCares: any[] = [];
  public diagnoses: any[] = [];
  public treatingDoctors: any = [];
  public referringDoctors: any[] = [];

  public visits: any[] = [];
  

  public charts: Array<{ name: string, data: any[] }> = [];

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
    });
  }

  private loadEpisodeOfCares(patientId: string): void {
    this.episodeOfCareService.list(patientId, this.startDate, this.endDate).subscribe((result: any[]) => {
      this.episodeOfCares = result;
      this.diagnoses = result.filter((x) => x.Diagnoses).map((x) => x.Diagnoses); 
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
