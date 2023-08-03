/* Copyright (c) 2022-2023 VMware, Inc. All rights reserved. */
package com.vmware.sample.remote.store;

import com.vmware.sample.remote.model.Chassis;

import java.util.List;

public interface ChassisStore {

   List<Chassis> getObjects();

   Chassis getObjectById(String id);

   Chassis create(Chassis chassis);

   boolean update(Chassis chassis);

   Chassis delete(String id);
}
