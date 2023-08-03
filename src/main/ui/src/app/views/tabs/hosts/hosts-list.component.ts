/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import {
   Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange
} from '@angular/core';

import { HostsService } from '~services/hosts.service';
import { Host } from '~models/host.model';
import { Chassis } from '~models/chassis.model';
import { GlobalService } from '~services/global.service';

@Component({
   selector: 'app-hosts-list-view',
   templateUrl: './hosts-list.component.html',
   styleUrls: ['./hosts-list.component.scss']
})
export class HostListComponent implements OnInit, OnChanges {

   @Input()
   preselectedHostsIds: string[];

   @Input()
   chassis: Chassis;

   @Output()
   hostsSelectionChange = new EventEmitter<string[]>();

   @Output()
   /* eslint-disable-next-line @angular-eslint/no-output-on-prefix */
   onNavigateToHostObject = new EventEmitter<any>();

   @Output()
   /* eslint-disable-next-line @angular-eslint/no-output-on-prefix */
   onError = new EventEmitter<Error>();

   loading: boolean = false;
   connectedHosts: Host[];

   private _selectedHosts: Host[] = [] as Host[];

   constructor(private hostsService: HostsService,
         private globalService: GlobalService) {
   }

   ngOnInit(): void {
      this.retrieveHosts();
   }

   ngOnChanges(changes: any) {
      const chassisChange: SimpleChange = changes['chassis'];
      if (chassisChange && !chassisChange.isFirstChange() &&
            this.shouldRetrieveHosts(chassisChange)) {
         this.retrieveHosts();
      }
   }

   onContextMenu(): boolean {
      return false;
   }

   /**
    * Setter of the two-way binding with the Datagrid's selected items
    *
    * @param selectedHosts - array of the updated Datagrid's selection
    */
   set selectedHosts(selectedHosts: Host[]) {
      this._selectedHosts = selectedHosts;
      if (!!selectedHosts) {
         this.emitHostSelectionChangeEvent(selectedHosts);
      }
   }

   /**
    * Getter of the two-way binding with the Datagrid's selected items
    */
   get selectedHosts(): Host[] {
      return this._selectedHosts;
   }

   /**
    * Navigate To the host summary view of a given objectId
    */
   navigateToHostObject(objectId: string): void {
      const navigateParams = {
         objectId
      };
      this.globalService.htmlClientSdk.app.navigateTo(navigateParams);
      this.onNavigateToHostObject.emit();
   }

   /**
    * Refresh the list of host objects.
    */
   private retrieveHosts(): void {
      this.loading = true;
      this.hostsService.getConnectedHosts(this.chassis)
            .subscribe((result: Host[]) => {
               this.connectedHosts = result;
               this.selectedHosts =
                     this.filterPreselectedHosts(this.connectedHosts);
               this.loading = false;
            }, (error: Error) => {
               this.loading = false;
               this.onError.emit(error);
            });
   }

   /**
    * Filter out an array of preselected Host objects out of all connected
    * Hosts objects
    *
    * @param hostsList
    */
   private filterPreselectedHosts(hostsList: Host[]): Host[] {
      if (!this.preselectedHostsIds) {
         return null;
      }
      return hostsList.filter((host: Host) =>
            this.preselectedHostsIds.indexOf(host.id) >= 0);
   }

   /**
    * Notify the consumers that Host objects selection has changed.
    *
    * @param selectedHosts
    */
   private emitHostSelectionChangeEvent(selectedHosts: Host[]) {
      this.hostsSelectionChange.emit(selectedHosts.map((host: Host) => host.id));
   }

   /**
    * Checks whether a new host has been added/removed to/from the chassis object
    */
   private shouldRetrieveHosts(chassisChange: SimpleChange): boolean {
      const previousHosts: string[] = chassisChange.previousValue.relatedHostsIds || [];
      const currentHosts: string[] = chassisChange.currentValue.relatedHostsIds || [];
      if (previousHosts.length !== currentHosts.length) {
         return true;
      }
      // Unique hosts in previousHosts
      const uniquePreviousHosts: string[] = previousHosts.filter((hostFromPrevious: string) =>
         !currentHosts.some((hostFromCurrent: string) => hostFromCurrent === hostFromPrevious));
      if (uniquePreviousHosts.length > 0) {
         return true;
      }
      // Unique hosts is currentHosts
      const uniqueCurrentHosts: string[] = currentHosts.filter((hostFromCurrent: string) =>
         !previousHosts.some((hostFromPrevious: string) => hostFromPrevious === hostFromCurrent));
      return uniqueCurrentHosts.length > 0;
   }
}
