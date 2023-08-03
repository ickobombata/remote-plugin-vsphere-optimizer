/* Copyright (c) 2018-2023 VMware, Inc. All rights reserved. */

import { Component, OnInit } from '@angular/core';
import { Chassis } from '~models/chassis.model';
import { ChassisService } from '~services/chassis.service';
import { ActivatedRoute } from '@angular/router';
import {
   AbstractControl,
   FormControl,
   FormGroup,
   Validators
} from '@angular/forms';
import { GlobalService } from '~services/global.service';

/**
 * Represents a form for creating or editing a chassis.
 */
@Component({
   templateUrl: './create-edit.component.html',
   styleUrls: ['./create-edit.component.scss']
})
export class CreateEditComponent implements OnInit {

   private static readonly EDIT_ACTION: string = 'edit';
   public chassis: Chassis;
   public action: string;
   public error: any;
   public form: FormGroup;

   get name() {
      return this.form.get('name');
   }

   constructor(private chassisService: ChassisService,
               private globalService: GlobalService,
               private route: ActivatedRoute) {
      this.action = route.snapshot.url[0].path;
      this.chassis = new Chassis();
   }

   ngOnInit(): void {
      if (this.isEditAction()) {
         (Object as any).assign(this.chassis,
               this.globalService.htmlClientSdk.app.getContextObjects()[0]);
      }

      this.form = new FormGroup({
         name: new FormControl(this.chassis.name, [Validators.required]),
         serverType: new FormControl(this.chassis.serverType),
         dimensions: new FormControl(this.chassis.dimensions),
         isActive: new FormControl(this.chassis.isActive)
      });
   }

   onSubmit(): void {
      Object.assign(this.chassis, this.form.value);
      if (this.isEditAction()) {
         this.edit();
      } else {
         this.create();
      }
   }

   onCancel(): void {
      this.globalService.htmlClientSdk.modal.close();
   }

   isEditAction(): boolean {
      return this.action === CreateEditComponent.EDIT_ACTION;
   }

   create(): void {
      this.chassisService.create(this.chassis).subscribe({
         error: () => this.onCancel(),
         complete: () => this.onCancel()
      });
   }

   edit(): void {
      this.chassisService.edit(this.chassis).subscribe({
         error: () => this.onCancel(),
         complete: () => this.onCancel()
      });
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

   isEmpty(control: AbstractControl): boolean {
      return control.invalid && (control.dirty || control.touched);
   }
}
