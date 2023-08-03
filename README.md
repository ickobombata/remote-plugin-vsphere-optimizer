# remote-plugin-vsphere-optimizer
A plugin developed by the Remote Plugin Architecture and deployable in the vSphere Client in order to do performance optimizations for VMs, Hosts, Clusters.

# License
This plug-in is downloaded from the vSphere Client SDK 8.0U1 and is used for presentational goals only.
The vSphere Client SDK: https://developer.vmware.com/web/sdk/8.0/client
This plugin is to be used for a hackathon project on VMware Explore 2023.

## Design
The overall idea is to keep track of given properties for VMs, Hosts, Clusters, Datacenters (in other words vCenter objects, maybe even custom defined objects by partners)
and to detect possible performance optimizations, such as reducing redundent resources (CPU, memory) of not needed VMs, Hosts. Further more 
suggesting possible changes to the infrastructure in order better to execute day to day workloads.
Another good functionality is the ability to detect if a customer might take adventage of a plugin which is already in the market (something like a suggest me a plugin for my needs)

The plugin takes advantage of the Remote Plugin Architecutre for the vSphere Client [vSphere Client SDK doc](https://developer.vmware.com/web/sdk/8.0/client).
Several extension points in the vSphere Client are used in order to have better integration between the plugin and the vSphere Client.
This includes cluster/host/vm summary, monitor and configure views in order to give a detailed per object information about possible/probable performance optimizations.
A global dashboard view which shows the overall information for the environment, and gives insights from a higher point of view.

# Technical details

# Requirements
- Java 8 (might work with higher)
- Maven 3.3.3 (might work with higher)

## Build
- ![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
- ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=for-the-badge&logo=Gradle&logoColor=white)
- ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

### Building the App
Navigate to the root folder and execute:
```
mvn validate
mvn clean install
```

## Deploy
The vSphere Client integrated installer is used to get the plugin deployed and installed on a given vSphere Client environment.
