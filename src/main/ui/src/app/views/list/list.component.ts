/* Copyright (c) 2018-2023 VMware, Inc. All rights reserved. */

import {Component, NgZone, OnInit} from '@angular/core';

import {Chassis} from '~models/chassis.model';
import {Message, MessageType} from '~models/message.model';
import {ChassisService} from '~services/chassis.service';
import {
   ConfirmationModalConfig,
   ModalConfig,
   ModalConfigService
} from '~services/modal.service';
import {GlobalService} from '~services/global.service';
import {MessagingService} from '~services/messaging.service';

// Specifies the loading type: 'implicit' means that the loading was triggered
// by a server message and a loading indicator will not be displayed for better UX;
// 'explicit' means that the loading was triggered by user-initiated
// global refresh and a loading indicator will be displayed; false means
// that there is no loading and a loading indicator will not be displayed.
type LoadingType = 'implicit' | 'explicit' | false;

// Specifies the trigger of a refresh: 'implicit' means that the trigger
// is a server message; 'explicit' means that the trigger is user-initiated
// global refresh.
type RefreshTriggerType = 'implicit' | 'explicit';

@Component({
   templateUrl: './list.component.html',
   styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
   selectedChassis: Chassis[];
   numberOfChassisPerPage: number;
   // The current loading.
   loading: LoadingType = false;
   private chassisMap: Map<string, Chassis>;
   // The loading that is scheduled to be run after the current loading
   // completes.
   private scheduledLoading: LoadingType = false;

   constructor(private zone: NgZone,
         private chassisService: ChassisService,
         private globalService: GlobalService,
         private modalService: ModalConfigService,
         private messagingService: MessagingService) {
   }

   ngOnInit(): void {
      this.chassisMap = new Map<string, Chassis>();
      this.selectedChassis = [];

      const navigationState = history.state;
      if (navigationState && navigationState.selectedChassis) {
         this.selectedChassis = navigationState.selectedChassis;
      }

      this.numberOfChassisPerPage = Chassis.DEFAULT_CHASSIS_PAGE_SIZE;
      const persistedNumberOfChassisPerPage =
            parseInt(localStorage.getItem(Chassis.PROP_CHASSIS_PAGE_SIZE), 10);
      if (persistedNumberOfChassisPerPage && persistedNumberOfChassisPerPage > 0) {
         this.numberOfChassisPerPage = persistedNumberOfChassisPerPage;
      }

      this.globalService.htmlClientSdk.event.onGlobalRefresh(() => {
         this.zone.run(() => {
            this.refresh('explicit');
         });
      });

      this.messagingService.messages$.subscribe((message: Message) => {
         if (message.type !== MessageType.chassisUpdated) {
            return;
         }

         this.refresh('implicit');
      });

      this.refresh('explicit');
   }

   onAdd(): void {
      const config: ModalConfig = this.modalService.createAddConfig();
      this.globalService.htmlClientSdk.modal.open(config);
   }

   onAddWizard(): void {
      const config: ModalConfig = this.modalService.createAddWizardConfig();
      this.globalService.htmlClientSdk.modal.open(config);
   }

   onDelete(): void {
      const chassisNames: string[] = this.selectedChassis.map((chassis: Chassis) => chassis.name);
      const config: ConfirmationModalConfig = this.modalService
            .createDeleteConfig(chassisNames, () => {
               this.deleteChassis();
            });
      this.globalService.htmlClientSdk.modal.openConfirmationModal(config);
   }

   onEdit(): void {
      const config: ModalConfig = this.modalService.createEditConfig();
      config.contextObjects = this.selectedChassis.map((value) => Object.assign(new Chassis(), value));
      this.globalService.htmlClientSdk.modal.open(config);
   }

   /**
    * Returns array of chassis objects.
    */
   get chassisList(): Chassis[] | null {
      if (this.chassisMap) {
         return Array.from(this.chassisMap.values());
      }
      return null;
   }

   /**
    * Refresh the list of chassis objects.
    */
   refresh(refreshTrigger: RefreshTriggerType): void {
      // If a loading is already running then schedule a loading to be
      // run after the current loading completes.
      if (this.loading) {
         // If an explicit refresh is triggered make the current loading explicit.
         if (refreshTrigger === 'explicit') {
            this.loading = 'explicit';
         }

         // If there is no explicit loading that is already scheduled, schedule
         // a loading with the specified type.
         if (this.scheduledLoading !== 'explicit') {
            this.scheduledLoading = refreshTrigger;
         }

         return;
      }

      this.loading = refreshTrigger;

      this.chassisService.getAllChassis().subscribe(result => {
         this.loading = false;
         if (this.scheduledLoading) {
            const scheduledRefreshTrigger: RefreshTriggerType = this.scheduledLoading;
            this.scheduledLoading = false;
            this.refresh(scheduledRefreshTrigger);
         }

         const oldSelectedChassisIds: { [key: string]: undefined } = {};
         this.selectedChassis.forEach(
               (item: Chassis) => oldSelectedChassisIds[item.id] = undefined
         );

         this.selectedChassis = [];
         this.chassisMap = new Map<string, Chassis>();

         result.forEach((item: Chassis) => {
            this.chassisMap.set(item.id, item);

            if (oldSelectedChassisIds.hasOwnProperty(item.id)) {
               this.selectedChassis.push(item);
            }
         });
      });
   }

   /**
    * Handler for the OK button of Delete Chassis Confirmation Modal.
    * On successful delete removes the deleted chassis from the list.
    */
   private deleteChassis() {
      const chassisIds: string[] = this.selectedChassis.map((chassis: Chassis) => chassis.id);
      this.chassisService.remove(chassisIds).subscribe();
   }
}
