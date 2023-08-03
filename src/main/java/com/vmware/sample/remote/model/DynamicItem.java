/* Copyright 2020-2023 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.sample.remote.model;

/**
 * Model showing the information needed by the vSphere Client in order to determine
 * whether the particular view/action should be visible in the UI
 */
public class DynamicItem {
   public String id;
   public boolean visible;

   public DynamicItem(String id, boolean visible) {
      this.id = id;
      this.visible = visible;
   }
}
