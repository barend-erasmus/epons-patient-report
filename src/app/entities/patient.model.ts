// Imports models
import { PatientAddress } from './../models/patient-address.model'

export class Patient {
    constructor(
        public id: string,
        public firstname: string,
        public lastname: string,
        public identificationNumber: string,
        public dateOfBirth: Date,
        public address: PatientAddress
    ) {

    }
}