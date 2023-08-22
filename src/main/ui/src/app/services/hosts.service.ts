/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import { Injectable } from '@angular/core';
import { Chassis } from '~models/chassis.model';
import { Host } from '~models/host.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class HostsService {

   constructor(private http: HttpClient) {
   }

   /**
    * Sends a get message to get all connected hosts
    */
   public getConnectedHosts(chassis: Chassis): Observable<Host[]> {
      const endpoint = chassis ? `chassis/${chassis.id}/hosts` : 'hosts';
      return this.http.get(endpoint)
            .pipe(mergeMap((result: Host[]) => of(result)));
   }

   /**
    * Sends a message to edit the Host object
    */
   public edit(host: Host): Observable<never> {
      const endpoint = 'hosts';
      return this.http.put(endpoint, host).pipe(map(_ => undefined)) as Observable<never>;
   }

   public optmize(): Observable<never> {
      const endpoint = 'scale';
      return this.http.post(endpoint, null).pipe(map(_ => undefined)) as Observable<never>;
   }
}
