// Imports models
import { Facility } from './../value-objects/facility.model';
import { TreatingDoctor } from './../value-objects/treating-doctor.model';
import { ReferringDoctor } from './../value-objects/referring-doctor.model';

export class EpisodeOfCare {
    constructor(public facility: Facility,
        public uniqueHospitalNumber: string,
        public admissionTimestamp: Date,
        public dischargeTimestamp: Date,
        public referringDoctor: ReferringDoctor,
        public treatingDoctor: TreatingDoctor) {

    }
}