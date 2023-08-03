/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import { Component, OnInit } from '@angular/core';
import { ChassisService } from '~services/chassis.service';
import { Chassis } from '~models/chassis.model';
import { GlobalService } from '~services/global.service';

@Component({
   templateUrl: './host-card.component.html',
   styleUrls: ['./host-card.component.scss']
})
export class HostCardComponent implements OnInit {
   private static readonly HOST_MONITOR_VIEW_NAVIGATION_ID = 'hostMonitor';

   public loading: boolean = true;
   public numberOfRelatedChassis: number;
   private contextObjectId: string;

   constructor(private chassisService: ChassisService,
         private globalService: GlobalService) {
   }

   ngOnInit(): void {
      this.contextObjectId =
            this.globalService.htmlClientSdk.app.getContextObjects()[0].id;
      this.loadData();
   }

   public navigateToHostMonitorView(): void {
      const navigateParams: any = {
         targetViewId: HostCardComponent.HOST_MONITOR_VIEW_NAVIGATION_ID,
         objectId: this.contextObjectId
      };
      this.globalService.htmlClientSdk.app.navigateTo(navigateParams);
   }

   private loadData(): void {
      this.chassisService.getRelatedChassis(this.contextObjectId)
            .subscribe((chassis: Chassis[]) => {
               this.numberOfRelatedChassis = chassis.length;
               this.loading = false;
            });
   }
}
