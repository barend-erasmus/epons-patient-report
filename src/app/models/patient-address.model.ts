// Imports models
import { Country } from './../value-objects/country.model';
import { City } from './../value-objects/city.model';
import { Province } from './../value-objects/province.model';


export class PatientAddress {
    constructor(public country: Country, public province: Province, public city: City, public street: string, public postalCode: string) {

    }
}