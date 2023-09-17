/* Copyright (c) 2020-2023 VMware, Inc. All rights reserved. */
package com.vmware.sample.remote.store.exception;

/**
 * Exception representing a failure when a chassis object has active relations with
 * vCenter Server Host objects.
 */
public class ExistingHostRelationException extends RuntimeException {
   public ExistingHostRelationException(final String message) {
      super(message);
   }
}
