/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrWizard, ClrWizardPage } from '@clr/angular';
import {
   AbstractControl,
   FormControl,
   FormGroup,
   Validators
} from '@angular/forms';
import { Chassis } from '~models/chassis.model';
import { ChassisService } from '~services/chassis.service';
import { GlobalService } from '~services/global.service';

@Component({
   templateUrl: './create-wizard.component.html',
   styleUrls: ['./create-wizard.component.scss']
})
export class CreateWizardComponent implements OnInit {
   @ViewChild('wizard') wizard: ClrWizard;
   @ViewChild('myFinishPage') finishPage: ClrWizardPage;

   error: any;
   readyToCompleteData: any = {};
   chassis: Chassis;
   wizardPage1Form: FormGroup;
   wizardPage2Form: FormGroup;

   constructor(private chassisService: ChassisService,
         private globalService: GlobalService) {
      this.chassis = new Chassis();
   }

   ngOnInit(): void {
      this.wizardPage1Form = new FormGroup({
         name: new FormControl(this.chassis.name, [Validators.required]),
         serverType: new FormControl(this.chassis.serverType)
      });
      this.wizardPage2Form = new FormGroup({
         dimensions: new FormControl(this.chassis.dimensions),
         isActive: new FormControl(this.chassis.isActive)
      });
   }

   loadReadyToCompletePageData(): void {
      Object.assign(this.chassis, this.wizardPage1Form.value, this.wizardPage2Form.value);
      this.readyToCompleteData = {
         name: this.chassis.name,
         serverType: this.formatEmptyOrNullValue(this.chassis.serverType),
         dimensions: this.formatEmptyOrNullValue(this.chassis.dimensions),
         state: this.chassis.isActive,
         hosts: this.chassis.relatedHostsIds
      };
   }

   onSubmit(): void {
      this.finishPage.completed = true;
      Object.assign(this.chassis, this.wizardPage1Form.value, this.wizardPage2Form.value);
      console.log(this.chassis);
      this.chassisService.create(this.chassis).subscribe({
         error: () => this.onCancel(),
         complete: () => this.onCancel()
      });
   }

   onGoBack(): void {
      this.wizard.previous();
   }

   onCancel(): void {
      this.wizard.close();
      this.globalService.htmlClientSdk.modal.close();
   }

   isNameEmpty() {
      const control: AbstractControl = this.wizardPage1Form.get('name');
      return control.invalid && (control.dirty || control.touched);
   }

   isNamePristine() {
      const control: AbstractControl = this.wizardPage1Form.get('name');
      return control.pristine;
   }

   onHostsSelectionChange(selectedHosts: string[]): void {
      this.chassis.relatedHostsIds = selectedHosts;
   }

   onNavigateToHostObject(): void {
      this.onCancel();
   }

   onError(error: any): void {
      const message: string = error.message ||
            'An error occurred! Please read the logs for more information';
      this.error = {
         message
      };
   }

   clearErrorMsg() {
      this.error = null;
   }

   private formatEmptyOrNullValue(value: string): string {
      if (typeof value !== 'string' || value.trim() === '') {
         return '--';
      }
      return value;
   }
}
