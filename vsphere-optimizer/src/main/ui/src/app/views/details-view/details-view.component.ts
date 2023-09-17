/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import {
   Component, Input
} from '@angular/core';
import { Chassis } from '~models/chassis.model';

@Component({
   selector: 'app-details-view',
   templateUrl: './details-view.component.html',
   styleUrls: ['./details-view.component.scss']
})
export class DetailsViewComponent {

   @Input()
   chassis: Chassis;
}
