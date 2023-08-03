/* Copyright (c) 2018-2023 VMware, Inc. All rights reserved. */

import { Injectable } from '@angular/core';
import { Chassis } from '~models/chassis.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class ChassisService {

   constructor(private http: HttpClient) {
   }

   /**
    * Creates a new object of type Chassis.
    *
    * @param chassis - the new chassis to be created.
    */
   public create(chassis: Chassis): Observable<never> {
      chassis.name = chassis.name.trim();
      return this.http.post('chassis', JSON.stringify(chassis))
            .pipe(map(_ => undefined)) as Observable<never>;
   }

   /**
    * Edit the given chassis.
    *
    * @param chassis - the edited chassis.
    */
   public edit(chassis: Chassis): Observable<never> {
      const newChassis: Chassis = Object.assign(new Chassis(), chassis);
      newChassis.name = newChassis.name.trim();
      return this.http.put('chassis/edit', JSON.stringify(chassis))
            .pipe(map(_ => undefined)) as Observable<never>;
   }

   public remove(target: string | string[]): Observable<boolean> {
      if (typeof target === 'string') {
         return this.http.delete(`chassis/${target}`)
            .pipe(map(_ => undefined)) as Observable<never>;
      } else {
         const chassisIds: string = target.join(',');
         return this.http.delete('chassis/delete', {
            params: {ids: `${chassisIds}`}
         }).pipe(map(_ => undefined)) as Observable<never>;
      }
   }

   /**
    * Retrieves all related Chassis to the provided objectId.
    *
    * @param objectId
    */
   public getRelatedChassis(objectId: string): Observable<Chassis[]> {
      return this.http.get(`hosts/${objectId}/chassis`)
            .pipe(mergeMap((result: Chassis[]) => of(result)));
   }

   /**
    * Retrieves all chassis.
    */
   public getAllChassis(): Observable<Chassis[]> {
      return this.http.get('chassis').pipe(
            mergeMap((result: Chassis[]) => {
               for (const chassis of result) {
                  chassis.healthStatus = 45;
                  chassis.complianceStatus = 81;
               }
               return of(result);
            }));
   }
}
