// Imports models
import { PatientAddress } from './../models/patient-address.model'

export class Patient {

    public age: number;

    constructor(
        public id: string,
        public firstname: string,
        public lastname: string,
        public identificationNumber: string,
        public dateOfBirth: Date,
        public address: PatientAddress,
        public avatar: string
    ) {
        this.calculateAge();
    }

    private calculateAge(): void {
        const ageDifMs = Date.now() - this.dateOfBirth.getTime();
        const ageDate = new Date(ageDifMs);
        this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}