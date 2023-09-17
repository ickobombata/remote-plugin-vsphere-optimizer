/* Copyright 2020-2023 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.sample.remote.model;

import java.util.List;

/**
 * The model shows what response information is needed by the vSphere Client when
 * retrieving the dynamic views/actions
 */
public class PluginServerDynamicItemsResponse {

   public String apiVersion;
   public List<DynamicItem> dynamicItems;

   public PluginServerDynamicItemsResponse(String apiVersion, List<DynamicItem> dynamicItems) {
      this.apiVersion = apiVersion;
      this.dynamicItems = dynamicItems;
   }
}
