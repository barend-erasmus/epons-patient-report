// Imports models
import { VitalSigns } from './../value-objects/vital-signs.model';

export class Visit {
    constructor(public timestamp: Date,
        public vitalSigns: VitalSigns) {

    }
}