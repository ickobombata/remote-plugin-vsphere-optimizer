/* Copyright (c) 2019-2023 VMware, Inc. All rights reserved. */

package com.vmware.sample.remote.controllers;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vmware.sample.remote.gateway.CloneSessionReply;
import com.vmware.sample.remote.gateway.GatewayCredentials;
import com.vmware.sample.remote.gateway.SessionService;
import com.vmware.sample.remote.model.Chassis;
import com.vmware.sample.remote.model.Host;
import com.vmware.sample.remote.services.ChassisService;
import com.vmware.sample.remote.services.HostService;
import com.vmware.sample.remote.util.CertificateUtil;
import com.vmware.sample.remote.vim25.services.VimObjectService;
import com.vmware.vim25.ManagedObjectReference;
import com.vmware.vim25.PerfQuerySpec;
import com.vmware.vim25.RuntimeFaultFaultMsg;
import com.vmware.vim25.ServiceContent;
import com.vmware.vim25.VimPortType;
import org.apache.commons.lang3.Validate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContexts;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.net.ssl.SSLContext;
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


   @RequestMapping(value ="/scale", method = RequestMethod.POST)
   public void scaleDownVm() {
      final RestTemplate restTemplate = buildRestTemplate();
      final String uri = UriComponentsBuilder
            .fromHttpUrl("https://sc2-10-186-44-103.eng.vmware.com")
            .path("/sdk/vim25/8.0.1.0/VirtualMachine/vm-16/ReconfigVM_Task").toUriString();

      ObjectNode json = null;
      try {
         json = new ObjectMapper().readValue("{\"spec\":{\"_typeName\":\"VirtualMachineConfigSpec\",\"memoryMB\": 256}}", ObjectNode.class);
      } catch (IOException e) {
         throw new RuntimeException(e);
      }
      final HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      headers.set("vmware-api-session-id", "92518bae225a14152c3144dcfe413869968529d6");

      restTemplate.exchange(uri, HttpMethod.POST,
                  new HttpEntity<>(json, headers),
                  Object.class).getBody();
   }

   private RestTemplate buildRestTemplate() {
      final SSLContext sslContext;
      try {
         final TrustStrategy acceptingTrustStrategy = new TrustStrategy() {
            @Override
            public boolean isTrusted(X509Certificate[] x509Certificates,
                  String s) {
               return true;
            }
         };
         sslContext = SSLContexts.custom()
               .loadTrustMaterial(null, acceptingTrustStrategy).build();
      } catch (KeyManagementException | NoSuchAlgorithmException |
               KeyStoreException e) {
         throw new RuntimeException("Failed to build an SSL context", e);
      }

      final SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(
            sslContext, NoopHostnameVerifier.INSTANCE);
      final CloseableHttpClient httpClient = HttpClients.custom()
            .setSSLSocketFactory(csf).build();

      final HttpComponentsClientHttpRequestFactory requestFactory =
            new HttpComponentsClientHttpRequestFactory();
      requestFactory.setHttpClient(httpClient);

      final RestTemplate restTemplate = new RestTemplate(requestFactory);
      return restTemplate;
   }



   // END HACAHTON

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
