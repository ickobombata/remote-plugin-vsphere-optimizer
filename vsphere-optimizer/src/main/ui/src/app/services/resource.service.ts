/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ResourceService {

   /* eslint-disable-next-line @typescript-eslint/ban-types */
   private localizedStrings: Object;
   private readonly strings: Array<string> = [
      'shared.modal.createChassis',
      'shared.modal.editChassis',
      'shared.modal.deleteChassis',
      'ok',
      'cancel',
      'actions.delete.content',
      'errors.vcenterConnectivity',
      'errors.duplicateChassisName',
      'errors.general',
      'errors.websocketSessionTicket'];

   constructor(private translate: TranslateService) {
   }

   public getString(str: string): string {
      return this.localizedStrings && this.localizedStrings.hasOwnProperty(
            str) ? this.localizedStrings[str] : str;
   }

   public loadStrings() {
      /* eslint-disable-next-line @typescript-eslint/ban-types */
      this.translate.get(this.strings).subscribe((result: Object) => {
         this.localizedStrings = result;
      });
   }
}
