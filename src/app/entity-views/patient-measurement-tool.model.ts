// Import models
import { MeasurementTool } from './../value-objects/measurement-tool.model';
import { Frequency } from './../value-objects/frequency.model';

export class PatientMeasurementTool {
    constructor(
        public assignedTimestamp: Date,
        public deassignedTimestamp: Date,
        public measurementTool: MeasurementTool,
        public frequency: Frequency
    ) {

    }
}