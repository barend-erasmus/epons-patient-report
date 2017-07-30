// Imports
import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

// Imports models
import { Visit } from './../entity-views/visit.model';

@Component({
  selector: 'app-vital-signs',
  templateUrl: './vital-signs.component.html',
  styleUrls: ['./vital-signs.component.css']
})
export class VitalSignsComponent implements OnChanges {

  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];

  public options: any = {
    responsive: true,
    elements: {
      line: {
        fill: false
      }
    }
  };

  public lineChartLegend: any;

  public lineChartType: string = 'line';

  public isInitialized = false;

  @Input()
  public data: Visit[] = null;

  constructor() { }

  public ngOnInit() {
  }

  public ngOnChanges(changes: any) {

    if (!this.data) {
      return;
    }

    if (this.data.length === 0) {
      return;
    }

    let tempData = this.data.filter((x) => x.vitalSigns.temperature || x.vitalSigns.bloodPressureDiastolic || x.vitalSigns.bloodPressureSystolic || x.vitalSigns.glucose || x.vitalSigns.heartRate || x.vitalSigns.pulseOximetry || x.vitalSigns.respiratoryRate);

    this.lineChartLabels = tempData.map((x) => moment(x.timestamp).format('YYYY-MM-DD'));
    this.lineChartData = [
      { data: tempData.map((x) => x.vitalSigns.temperature), label: 'Temperature' },
      { data: tempData.map((x) => x.vitalSigns.bloodPressureSystolic), label: 'Blood Pressure Systolic' },
      { data: tempData.map((x) => x.vitalSigns.bloodPressureDiastolic), label: 'Blood Pressure Diastolic' },
      { data: tempData.map((x) => x.vitalSigns.glucose), label: 'Glucose' },
      { data: tempData.map((x) => x.vitalSigns.heartRate), label: 'Heart Rate' },
      { data: tempData.map((x) => x.vitalSigns.pulseOximetry), label: 'Pulse Oximetry' },
      { data: tempData.map((x) => x.vitalSigns.respiratoryRate), label: 'Respiratory Rate' }
    ];

    this.isInitialized = true;
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
