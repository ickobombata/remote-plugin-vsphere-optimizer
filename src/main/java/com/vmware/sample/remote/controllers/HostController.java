/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

package com.vmware.sample.remote.controllers;

import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.stream.Collectors;

import com.vmware.sample.remote.gateway.SessionService;
import com.vmware.sample.remote.model.Chassis;
import com.vmware.sample.remote.model.Host;
import com.vmware.sample.remote.services.ChassisService;
import com.vmware.sample.remote.services.HostService;
import com.vmware.sample.remote.vim25.services.VimObjectService;
import com.vmware.vim25.ManagedObjectReference;
import com.vmware.vim25.PerfQuerySpec;
import com.vmware.vim25.RuntimeFaultFaultMsg;
import com.vmware.vim25.ServiceContent;
import com.vmware.vim25.VimPortType;
import org.apache.commons.lang3.Validate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.util.Date;

/**
 * A controller which returns information about vSphere host objects.
 */
@RestController
@RequestMapping("/rest")
public class HostController {
   private static final Log logger = LogFactory.getLog(
         HostController.class);

   private final HostService vcenterInfoService;
   private final ChassisService chassisService;

   private final SessionService sessionService;

   public HostController(final HostService vcenterInfoService,
         final ChassisService chassisService,
         final SessionService sessionService) {
      this.vcenterInfoService = vcenterInfoService;
      this.chassisService = chassisService;
      this.sessionService = sessionService;
   }

   // HACHATHON implementation
   private static final String PROP_SERVICE_INSTANCE = "ServiceInstance";
   private static final String PROP_HOST = "HostSystem";

   @RequestMapping(value = "/vm", method = RequestMethod.GET)
   public String retrieveVmInfo() throws DatatypeConfigurationException {
      final VimPortType vimPort = this.sessionService.getVimSessionInfo().getVimPort();

      ServiceContent serviceContent = null;
      try {
         ManagedObjectReference serviceInstanceRef = createSvcInstanceRef();

         serviceContent = vimPort.retrieveServiceContent(serviceInstanceRef);
      } catch (RuntimeFaultFaultMsg runtimeFaultFaultMsg) {
         logger.warn(
               "Could not retrieve the ServiceContent using sessionCookie",
               runtimeFaultFaultMsg);
      }
      if (serviceContent == null) {
         return "";
      }
      // Get references to the ViewManager and the PropertyCollector
      final ManagedObjectReference viewMgrRef = serviceContent.getViewManager();
      final ManagedObjectReference propColl = serviceContent
            .getPropertyCollector();

      final ManagedObjectReference vmRef = new ManagedObjectReference();
      vmRef.setType("VirtualMachine");
      vmRef.setValue("vm-16");

      GregorianCalendar startCal = new GregorianCalendar();
      startCal.set(2023, 8, 10);
      XMLGregorianCalendar start = DatatypeFactory.newInstance().newXMLGregorianCalendar(startCal);

      GregorianCalendar endCal = new GregorianCalendar();
      endCal.set(2023, 8, 5);
      XMLGregorianCalendar end = DatatypeFactory.newInstance().newXMLGregorianCalendar(endCal);

      final PerfQuerySpec perfSpec = new PerfQuerySpec();
      perfSpec.setIntervalId(20);
      perfSpec.setEntity(vmRef);
      perfSpec.setStartTime(start);
      perfSpec.setEndTime(end);



      //vimPort.queryPerf

      // Create a container view for the vSphere Object.
      final List<String> vObjects = Collections.singletonList(PROP_HOST);


      return "1";
   }

   private ManagedObjectReference createSvcInstanceRef() {
      final ManagedObjectReference svcInstanceRef = new ManagedObjectReference();
      svcInstanceRef.setType(PROP_SERVICE_INSTANCE);
      svcInstanceRef.setValue(PROP_SERVICE_INSTANCE);

      return svcInstanceRef;
   }


















   /**
    * Retrieves all host objects connected to the vCenter Server.
    * Currently there is no relation between hosts/chassis, but everyone is
    * free to implement any kind of relation between them and filter them by a
    * provided parameter representing a chassis.
    * @return list of host objects.
    */
   @RequestMapping(value = "/hosts", method = RequestMethod.GET)
   public List<Host> retrieveConnectedHosts() {
      return vcenterInfoService.retrieveConnectedHosts();
   }

   /**
    * Retrieves all chassis related to the given Host object
    * @return list of related Chassis objects.
    */
   @RequestMapping(value = "/hosts/{hostId}/chassis", method = RequestMethod.GET)
   public List<Chassis> retrieveRelatedChassis(
         @PathVariable("hostId") final String hostId) {
      Validate.notNull(hostId);
      return chassisService.getRelatedChassis(hostId);
   }

   /**
    * Retrieves all connected host objects related to the given chassis.
    * Removes hosts from the relation that are no longer connected or
    * available to the vCenter Server.
    *
    * @return list of host objects filtered by the provided chassisId.
    */
   @RequestMapping(value = "/chassis/{chassisId}/hosts", method = RequestMethod.GET)
   public List<Host> retrieveConnectedHosts(
         @PathVariable("chassisId") final String chassisId) {
      final List<Host> hostsList = vcenterInfoService
            .retrieveConnectedHosts(chassisId);

      chassisService.setRelatedHosts(chassisId,
            hostsList.stream().map(host -> host.id)
                  .collect(Collectors.toList()));

      return hostsList;
   }

   @RequestMapping(value = "/hosts", method = RequestMethod.PUT)
   public void edit(@RequestBody final Host host) {
      chassisService.updateHostRelation(host);
   }

}
