import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class HttpService {

    private base_api = environment.BASE_API  // URL to web api
    private headers = new HttpHeaders({
                            'Content-Type': 'application/json; charset=utf-8'
                        });

    constructor(private http: HttpClient) {

    }

    get(module, filters?, orders?) {

        let data = {
                        headers: this.headers,
                        params: {
                            module: module,
                            filters: filters,
                            orders: orders
                        }
                    };
        
        if(filters && typeof filters === "object")
            data.params.filters = JSON.stringify(filters);
        
        if(orders && typeof orders === "object")
            data.params.orders = JSON.stringify(orders);
        
        return this.http
            .get(
                this.base_api,
                data
            ).pipe(
                map(response => {
                    let res:any = response;
                    if(res.done) {
                        if((res.data) && (typeof res.data === "object")) {
                            let data = res.data;
                            return data;
                        }
                    } else {
                        alert('ERROR!!!');
                    }                
                }),
                catchError(
                    this.catchError(this)
                )
            );
    }

    create(params) {

        let options = { headers: this.headers };
        return this.http
            .post(
                this.base_api,
                params,
                options
            ).pipe(
                map(response => {
                    return response;  
                }),
                catchError(
                    this.catchError(this)
                )
            );
    }

    delete(module, params) {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
        });
        let options = {
            headers: headers,
            body: params
        };
        
        return this.http
            .delete(
                this.base_api + '/' + module + '/api',
                options
            ).pipe(
                map(response => {
                    return response;
                }),
                catchError(
                    this.catchError(this)
                )
            );
    }

    catchError (self: HttpService) {   
        return (response: Response) => { 
            // any
            return Observable.throw(response);
        };
    }

}