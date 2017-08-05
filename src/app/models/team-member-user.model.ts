// Imports models
import { Position } from './../value-objects/position.model';
import { UserPermission } from './user-permission.model';

export class TeamMemberUser {
    constructor(public id: string, public fullname: string, public position: Position, public permissions: UserPermission[]) {
        
    }
}