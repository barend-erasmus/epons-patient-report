// Imports
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class BaseService {

    private baseUri: string = 'http://api.sadfm.co.za';
    // private baseUri: string = 'http://localhost:4484';

    constructor(private http: Http) {

    }

    protected post(uri: string, obj: any): Observable<Response> {
        const headers = new Headers();
        headers.append('apikey', '2c0d64c1-d002-45f2-9dc4-784c24e996');

        const jwtToken = localStorage.getItem('jwt.token');

        if (jwtToken !== null || jwtToken === '') {
            headers.append('Authorization', 'Bearer ' + jwtToken);
        }

        return this.http.post(`${this.baseUri}${uri}`, obj, {
            headers,
        });
    }

    protected get(uri: string): Observable<Response> {
        const headers = new Headers();
        headers.append('apikey', '2c0d64c1-d002-45f2-9dc4-784c24e996');

        const jwtToken = localStorage.getItem('jwt.token');

        if (jwtToken !== null || jwtToken === '') {
            headers.append('Authorization', 'Bearer ' + jwtToken);
        }

        return this.http.get(`${this.baseUri}${uri}`, {
            headers,
        });
    }
}