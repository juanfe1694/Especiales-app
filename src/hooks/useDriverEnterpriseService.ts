import { child, push, ref, set, onValue, update } from "firebase/database";
import { scheduleServiceCompany, serviceCompanyModel } from "../interfaces/services/servicesInterfaces";

import React, { useState } from 'react'
import { rtdb } from "../services/realtimeDBService";

export const useDriverEnterpriseService = () => {
   const [asignedServices, setAsignedServices] = useState<any[]>([]);
   const [confirmedServices, setConfirmedServices] = useState<any[]>([]);
   const [activeServices, setActiveServices] = useState<any[]>([]);
   const [historicServices, setHistoricServices] = useState<any[]>([]);
   const [rejectedServices, setRejectedServices] = useState<any[]>([]);
   const [isLoading, setisLoading] = useState(true);

   const services = [ ...confirmedServices, ...historicServices ];
   const currentServices = [...asignedServices, ...confirmedServices, ...activeServices];
  
   const getEnterpriseServices = (driverId: bigint) => {

      /** Configuro los objetos de escucha */
      const asignedRef = ref(rtdb, 'servicios-empresariales/conductores/asignados/' + driverId );
      const confirmRef = ref(rtdb, 'servicios-empresariales/conductores/confirmados/' + driverId );
      const historicRef = ref(rtdb, 'servicios-empresariales/conductores/historial/' + driverId );
      const rejectedRef = ref(rtdb, 'servicios-empresariales/conductores/rechazados/' + driverId );
      const activeRef = ref(rtdb, 'servicios-empresariales/conductores/transito/' + driverId );
      
      /** Servicios asignados */
      onValue(asignedRef, (snapshot) => {
         if(snapshot.exists()){
          const arrayData : any[] = [];
          snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
          setAsignedServices(arrayData);

         } else {
            setAsignedServices([]);
         }
         setisLoading(false);
       });
      /** Servicios confirmados */
      onValue(confirmRef, (snapshot) => {
         if(snapshot.exists()){
          const arrayData : any[] = [];
          snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
          setConfirmedServices(arrayData);

         } else {
            setConfirmedServices([]);
         }
         setisLoading(false);
       });
       /** Servicios en transito */
      onValue(activeRef, (snapshot) => {
         if(snapshot.exists()){
          const arrayData : any[] = [];
          snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
          setActiveServices(arrayData);

         } else {
            setActiveServices([]);
         }
         setisLoading(false);
       });
       /** Historial de servicios */
       onValue(historicRef, (snapshot) => {

         if(snapshot.exists()){
          const arrayData : any[] = [];
          snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
          setHistoricServices(arrayData);
         } else {
            setHistoricServices([]);
         }
       });
       /** Servicios rechazados por el conductor */
       onValue(rejectedRef, (snapshot) => {

         if(snapshot.exists()){
          const arrayData : any[] = [];
          snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
          setRejectedServices(arrayData);
         } else {
            setRejectedServices([]);
         }
       });
   }    

   const resEnterpriseService = (postData: any) => {
      const serviceRef = ref(rtdb, `servicios-empresariales/`);
      const pickUpDate = new Date(postData.pickUpDate).toUTCString();
      const { requester, serviceId, driver } = postData;
      const pendingRef = 'clientes/asignados/' + requester + '/' + serviceId;
      const driverPendingRef = 'conductores/asignados/' + driver.id + '/' + serviceId;
      const confirmRef = 'clientes/confirmados/' + requester + '/' + serviceId;
      const driverConfirmRef = 'conductores/confirmados/' + driver.id + '/' + serviceId;
      
      var service: any = {};
      /** Elimino el registro de pendientes */
      service[ pendingRef ] = null;
      service[ driverPendingRef ] = null;
      /** Agrego el registro a confirmados usuario */
      service[ confirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Confirmado'};
      /** Agrego el registro a confirmados conductor */
      service[ driverConfirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Confirmado'};

      return update(serviceRef, service);
   }

   const rejectEnterpriseService = (postData: any) => {
      const serviceRef = ref(rtdb, `servicios-empresariales/`);
      const pickUpDate = new Date(postData.pickUpDate).toUTCString();
      const { requester, serviceId, driver } = postData;
      const pendingRef = 'clientes/asignados/' + requester + '/' + serviceId;
      const driverPendingRef = 'conductores/asignados/' + driver.id + '/' + serviceId;
      const confirmRef = 'clientes/pendientes/' + requester + '/' + serviceId;
      const driverConfirmRef = 'conductores/rechazados/' + driver.id + '/' + serviceId;
      
      var service: any = {};
      /** Elimino el registro de pendientes */
      service[ pendingRef ] = null;
      service[ driverPendingRef ] = null;
      /** Agrego el registro a confirmados usuario */
      service[ confirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Rechazado'};
      /** Agrego el registro a confirmados conductor */
      service[ driverConfirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Rechazado'};

      return update(serviceRef, service);
   }

   const cancelEnterpriseService = (postData: any) => {
      const serviceRef = ref(rtdb, `servicios-empresariales/`);
      const pickUpDate = new Date(postData.pickUpDate).toUTCString();
      const { requester, serviceId, driver } = postData;
      const pendingRef = 'clientes/confirmados/' + requester + '/' + serviceId;
      const driverPendingRef = 'conductores/confirmados/' + driver.id + '/' + serviceId;
      const confirmRef = 'clientes/pendientes/' + requester + '/' + serviceId;
      const driverConfirmRef = 'conductores/rechazados/' + driver.id + '/' + serviceId;
      
      var service: any = {};
      /** Elimino el registro de pendientes */
      service[ pendingRef ] = null;
      service[ driverPendingRef ] = null;
      /** Agrego el registro a confirmados usuario */
      service[ confirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Rechazado'};
      /** Agrego el registro a confirmados conductor */
      service[ driverConfirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Rechazado'};

      return update(serviceRef, service);
   }
   /** Iniciar servicio empresarial */
   const startEnterpriseService = (postData: any) => {
      const serviceRef = ref(rtdb, `servicios-empresariales/`);
      const pickUpDate = new Date(postData.pickUpDate).toUTCString();
      const { requester, serviceId, driver } = postData;
      const pendingRef = 'clientes/confirmados/' + requester + '/' + serviceId;
      const driverPendingRef = 'conductores/confirmados/' + driver.id + '/' + serviceId;
      const confirmRef = 'clientes/transito/' + requester + '/' + serviceId;
      const driverConfirmRef = 'conductores/transito/' + driver.id + '/' + serviceId;
      
      var service: any = {};
      /** Elimino el registro de pendientes */
      service[ pendingRef ] = null;
      service[ driverPendingRef ] = null;
      /** Agrego el registro a confirmados usuario */
      service[ confirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Transito'};
      /** Agrego el registro a confirmados conductor */
      service[ driverConfirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Transito'};

      return update(serviceRef, service);
   }
   /** Finalizar servicio empresarial */
   const endEnterpriseService = (postData: any) => {
      const serviceRef = ref(rtdb, `servicios-empresariales/`);
      const pickUpDate = new Date(postData.pickUpDate).toUTCString();
      const { requester, serviceId, driver } = postData;
      const pendingRef = 'clientes/transito/' + requester + '/' + serviceId;
      const driverPendingRef = 'conductores/transito/' + driver.id + '/' + serviceId;
      const confirmRef = 'clientes/historial/' + requester + '/' + serviceId;
      const driverConfirmRef = 'conductores/historial/' + driver.id + '/' + serviceId;

      var service: any = {};
      /** Elimino el registro de pendientes */
      service[ pendingRef ] = null;
      service[ driverPendingRef ] = null;
      /** Agrego el registro a confirmados usuario */
      service[ confirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Completado'};
      /** Agrego el registro a confirmados conductor */
      service[ driverConfirmRef ] = {...postData, pickUpDate: pickUpDate, requestState: 'Completado'};

      return update(serviceRef, service);
   }
   return { 
      getEnterpriseServices,
      resEnterpriseService, 
      rejectEnterpriseService,
      cancelEnterpriseService,
      startEnterpriseService,
      endEnterpriseService,
      confirmedServices, 
      historicServices,
      rejectedServices,
      services, 
      currentServices,
      isLoading 
   }
}

