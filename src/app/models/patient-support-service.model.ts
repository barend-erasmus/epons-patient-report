// Imports models
import { SupportService } from './../value-objects/support-service.model';

export class PatientSupportService {
    constructor(public supportService: SupportService, public text: string) {

    }
}