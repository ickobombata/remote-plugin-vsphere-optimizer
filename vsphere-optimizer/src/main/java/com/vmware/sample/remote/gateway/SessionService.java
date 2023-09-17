/* Copyright 2019-2023 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.sample.remote.gateway;

public interface SessionService {

   VimSessionInfo getVimSessionInfo();

   VimSessionInfo getVimSessionInfo(final GatewayCredentials credentials);
}
