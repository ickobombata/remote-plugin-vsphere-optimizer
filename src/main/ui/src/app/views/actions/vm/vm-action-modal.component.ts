/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import { Component } from '@angular/core';
import { GlobalService } from '~services/global.service';
import { HostsService } from '~services/hosts.service';

@Component({
   templateUrl: './vm-action-modal.component.html',
   styles: [`form {
       padding: 1rem;
   }`]
})
export class VmActionModalComponent {
   constructor(private globalService: GlobalService,
    private hostsService: HostsService) {
   }

   onClose(): void {
      this.closeModal();
   }

   onSubmit(): void {
      this.hostsService.optmize().subscribe({
         error: () => console.log('error bro'),
         complete: () => this.closeModal()
      });
   }

   private closeModal(): void {
      this.globalService.htmlClientSdk.modal.close();
   }
}
