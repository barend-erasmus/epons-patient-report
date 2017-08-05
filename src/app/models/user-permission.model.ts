// Imports models
import { Facility } from './../value-objects/facility.model';
import { Permission } from './../value-objects/permision.model';

export class UserPermission {
    constructor(public facility: Facility, public permission: Permission) {

    }
}