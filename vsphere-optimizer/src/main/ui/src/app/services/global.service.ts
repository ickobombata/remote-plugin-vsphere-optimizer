/* Copyright (c) 2018-2023 VMware, Inc. All rights reserved. */

import {Injectable} from '@angular/core';

@Injectable()
export class GlobalService {
   public htmlClientSdk: any;

   constructor() {
      this.htmlClientSdk = (window as any).htmlClientSdk;
   }
}
