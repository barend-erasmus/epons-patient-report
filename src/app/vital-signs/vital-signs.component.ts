// Imports
import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

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
  public data: any[] = null;

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

    let tempData = this.data.filter((x) => x.VitalSigns.Temperature || x.VitalSigns.BloodPressureDiastolic || x.VitalSigns.BloodPressureSystolic || x.VitalSigns.Glucose || x.VitalSigns.HeartRate || x.VitalSigns.PulseOximetry || x.VitalSigns.RespiratoryRate);

    this.lineChartLabels = tempData.map((x) => moment(x.Timestamp).format('YYYY-MM-DD HH:mm'));
    this.lineChartData = [
      { data: tempData.map((x) => x.VitalSigns.Temperature), label: 'Temperature' },
      { data: tempData.map((x) => x.VitalSigns.BloodPressureSystolic), label: 'Blood Pressure Systolic' },
      { data: tempData.map((x) => x.VitalSigns.BloodPressureDiastolic), label: 'Blood Pressure Diastolic' },
      { data: tempData.map((x) => x.VitalSigns.Glucose), label: 'Glucose' },
      { data: tempData.map((x) => x.VitalSigns.HeartRate), label: 'Heart Rate' },
      { data: tempData.map((x) => x.VitalSigns.PulseOximetry), label: 'Pulse Oximetry' },
      { data: tempData.map((x) => x.VitalSigns.RespiratoryRate), label: 'Respiratory Rate' }
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
