// Imports models
import { Facility } from './../value-objects/facility.model';
import { Diagnoses } from './../value-objects/diagnoses.model';
import { ImpairmentGroup } from './../value-objects/impairment-group.model';
import { TreatingDoctor } from './../value-objects/treating-doctor.model';
import { ReferringDoctor } from './../value-objects/referring-doctor.model';

export class EpisodeOfCare {
    constructor(public facility: Facility,
        public uniqueHospitalNumber: string,
        public admissionTimestamp: Date,
        public dischargeTimestamp: Date,
        public onsetTimestamp: Date,
        public diagnoses: Diagnoses,
        public impairmentGroup: ImpairmentGroup,
        public referringDoctor: ReferringDoctor,
        public treatingDoctor: TreatingDoctor) {

    }
}