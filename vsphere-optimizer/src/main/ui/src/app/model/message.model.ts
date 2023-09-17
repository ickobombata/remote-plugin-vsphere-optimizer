/* Copyright (c) 2020-2023 VMware, Inc. All rights reserved. */

export enum MessageType {
   chassisUpdated = 'CHASSIS_UPDATED'
}

export interface Message {
   type: MessageType;
}
