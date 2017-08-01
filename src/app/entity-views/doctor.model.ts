// Imports models
import { DoctorContactDetails } from './../models/doctor-contact-details.model';

export class Doctor {
    constructor(
        public fullname: string,
        public contactDetails: DoctorContactDetails,
        public hpcsaNumber: string,
        public practiceNumber: string
    ) {

    }
}