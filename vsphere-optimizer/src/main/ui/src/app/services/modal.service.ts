/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import {Injectable} from '@angular/core';
import {ResourceService} from './resource.service';

export interface ModalConfig {
   url: string;
   title?: string;
   accessibilityTitle?: string;
   size?: {
      width: number;
      height: number;
   };
   closable?: boolean;
   onClosed?: (result?: any) => void;
   contextObjects?: any[];
   customData?: any;
}

export interface ConfirmationModalConfig {
   content: string;
   buttons: ModalButton[];
   size?: ModalSize;
   alertLevel?: AlertLevel;
   title?: string;
   accessibilityTitle?: string;
   secondaryTitle?: string;
   closable?: boolean;
   onClosed?: () => void;
}

interface ModalSize {
   width: number;
}

interface ModalButton {
   label: string;
   type?: ButtonType;
   style?: ButtonStyle;
   callback?: () => void;
}

enum ButtonType {
   PRIMARY = 'PRIMARY',
   SECONDARY = 'SECONDARY'
}

enum ButtonStyle {
   SUCCESS = 'SUCCESS',
   INFO = 'INFO',
   WARNING = 'WARNING',
   DANGER = 'DANGER'
}

enum AlertLevel {
   SUCCESS = 'SUCCESS',
   INFO = 'INFO',
   WARNING = 'WARNING',
   DANGER = 'DANGER'
}

@Injectable()
export class ModalConfigService {

   constructor(private resources: ResourceService) {
   }

   public createAddConfig(): ModalConfig {
      const addAction: ModalConfig = {
         url: 'index.html#/create',
         title: this.resources.getString('shared.modal.createChassis'),
         size: { width: 780, height: 500 }
      };
      return addAction;
   }

   public createAddWizardConfig(): ModalConfig {
      const addWizardAction: ModalConfig = {
         url: 'index.html#/create-wizard',
         accessibilityTitle: this.resources.getString('shared.modal.createChassis'),
         closable: false,
         size: { width: 900, height: 500 }
      };
      return addWizardAction;
   }

   /* eslint-disable-next-line @typescript-eslint/ban-types */
   public createDeleteConfig(chassisNames: string[], confirmationHandler: Function): ConfirmationModalConfig {
      const deleteAction: ConfirmationModalConfig = {
         content: this.resources.getString('actions.delete.content'),
         title: this.resources.getString('shared.modal.deleteChassis'),
         secondaryTitle: chassisNames.join(','),
         size: {
            width: 300
         } as ModalSize,
         buttons: [{
            label: this.resources.getString('cancel'),
            type: ButtonType.PRIMARY
         }, {
            label: this.resources.getString('ok'),
            type: ButtonType.SECONDARY,
            callback: () => confirmationHandler()
         }] as ModalButton[],
         alertLevel: AlertLevel.DANGER
      } as ConfirmationModalConfig;
      return deleteAction;
   }

   public createEditConfig(): ModalConfig {
      const editAction: ModalConfig = {
         url: 'index.html#/edit',
         title: this.resources.getString('shared.modal.editChassis'),
         size: { width: 780, height: 500 }
      };
      return editAction;
   }
}
