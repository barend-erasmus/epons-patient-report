// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// Imports services
import { BaseService } from './base.service';

// Imports models
import { TeamMember } from './../entity-views/team-member.model'
import { Facility } from './../value-objects/facility.model';
import { TeamMemberUser } from './../models/team-member-user.model';
import { Position } from './../value-objects/position.model';
import { UserPermission } from './../models/user-permission.model';
import { Permission } from './../value-objects/permision.model';

@Injectable()
export class TeamMemberService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  public list(patientId: string, startDate: Date, endDate: Date): Observable<TeamMember[]> {
    return this.get(`/api/TeamMember/List?patientId=${patientId}&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`).map((x) => {

      const json: any[] = x.json();

      const result = json.map((x) => new TeamMember(x.Facility? new Facility(x.Facility.Id, x.Facility.Name) : null, new TeamMemberUser(x.User.Id, x.User.Fullname, x.User.Position? new Position(x.User.Position.Id, x.User.Position.Name) : null, x.User.Permissions.map((y) => new UserPermission(null, null))), x.AllocationTimestamp, x.DeallocationTimestamp));

      return result;
    });
  }
}
