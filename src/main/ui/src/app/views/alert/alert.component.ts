/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */
import { Component, Input } from '@angular/core';

@Component({
   selector: 'app-alert-message',
   templateUrl: './alert.component.html'
})
export class AlertComponent {
   @Input()
   error: any;

   onAlertClose(): void {
      this.error = null;
   }
}
