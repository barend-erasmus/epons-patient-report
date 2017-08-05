// Imports models
import { Facility } from './../value-objects/facility.model';
import { TeamMemberUser } from './../models/team-member-user.model';

export class TeamMember {
    constructor(public facility: Facility,
        public user: TeamMemberUser,
        public allocationTimestamp: Date,
        public deallocationTimestamp: Date) {

    }
}