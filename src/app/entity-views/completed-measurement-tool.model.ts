// Imports models
import { MeasurementTool } from './../value-objects/measurement-tool.model';

export class CompletedMeasurementTool {
    constructor(public measurementTool: MeasurementTool, public startDate: Date, public endDate: Date, public scoreItems: any[]) {

    }
}