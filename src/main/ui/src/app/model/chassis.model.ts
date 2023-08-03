/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

export class Chassis {
   static readonly DEFAULT_CHASSIS_PAGE_SIZE: number = 10;
   static readonly PROP_CHASSIS_PAGE_SIZE: string = 'com.vmware.samples.remote.numberChassisPerPage';
   id: string;
   name: string;
   dimensions: string;
   serverType: string;
   isActive: boolean;
   healthStatus: number;
   complianceStatus: number;
   relatedHostsIds: string[];
}
