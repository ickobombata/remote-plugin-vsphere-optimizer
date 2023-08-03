/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */
export class Host {
   id: string;
   name: string;
   vCenterName: string;
   state: string;
   numCpus: string;
   memorySize: string;
   relatedChassisIds: string[];
}
