/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import {Component, Input} from '@angular/core';
import {Chassis} from '~models/chassis.model';

@Component({
   selector: 'app-summary-view',
   templateUrl: './summary.component.html'
})
export class SummaryComponent {
   @Input()
   chassis: Chassis;
}
