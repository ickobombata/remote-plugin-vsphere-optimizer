/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import {
   Component,
   Input,
   NgZone
} from '@angular/core';

import { Chassis } from '~models/chassis.model';
import { ChassisService } from '~services/chassis.service';
import {
   ConfirmationModalConfig,
   ModalConfig,
   ModalConfigService
} from '~services/modal.service';
import { GlobalService } from '~services/global.service';

@Component({
   selector: 'app-custom-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

   @Input()
   chassis: Chassis;

   constructor(private zone: NgZone,
         private chassisService: ChassisService,
         private modalService: ModalConfigService,
         private globalService: GlobalService) {
   }

   onDelete(): void {
      const config: ConfirmationModalConfig = this.modalService
            .createDeleteConfig([this.chassis.name], () => {
               this.deleteChassis();
            });
      this.globalService.htmlClientSdk.modal.openConfirmationModal(config);
   }

   onEdit(): void {
      const config: ModalConfig = this.modalService.createEditConfig();
      config.contextObjects = [Object.assign(new Chassis(), this.chassis)];
      this.globalService.htmlClientSdk.modal.open(config);
   }

   onActivate(): void {
      const newChassis = Object.assign(new Chassis(), this.chassis);
      newChassis.isActive = true;
      this.chassisService.edit(newChassis).subscribe();
   }

   private deleteChassis() {
      this.chassisService.remove(this.chassis.id).subscribe();
   }
}
