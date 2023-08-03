/* Copyright (c) 2020-2023 VMware, Inc. All rights reserved. */
package com.vmware.sample.remote.store.exception;

/**
 * Exception representing a failure when a chassis object already exists.
 */
public class ExistingChassisObjectException extends RuntimeException {
   public ExistingChassisObjectException(final String message) {
      super(message);
   }
}
