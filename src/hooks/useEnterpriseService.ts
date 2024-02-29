import { child, getDatabase, push, ref, set, onValue } from "firebase/database";
import { scheduleServiceCompany, serviceCompanyModel } from "../interfaces/services/servicesInterfaces";

import React, { useState } from 'react'
import { rtdb } from "../services/realtimeDBService";

export const useEnterpriseService = () => {

   const [pendingServices, setPendingServices] = useState<any[]>([]);
   const [confirmedServices, setConfirmedServices] = useState<any[]>([]);
   const [historicServices, setHistoricServices] = useState<any[]>([]);
   const [isLoading, setisLoading] = useState(true);

   const services = [...pendingServices, ...confirmedServices, ...historicServices ];
   const saveEnterpriseService = (requestService: scheduleServiceCompany) => {
      
      let newRequestService : serviceCompanyModel = {
         ...requestService,
         pickUpDate: requestService.pickUpDate.toUTCString(),
         pickUpTime: requestService.pickUpDate.toUTCString()
      }
      if(requestService.returnDate ){ 
         newRequestService.returnDate = (newRequestService?.returnDate as Date).toUTCString()
         newRequestService.returnTime = (newRequestService?.returnTime as Date).toUTCString()
      }

      const newPostKey = push(child(ref(rtdb), 'servicios-empresariales')).key;
      set(
         ref(
            rtdb,
            'servicios-empresariales/pendientes/' 
            + requestService.requester 
            + '/' 
            + newPostKey
         ), 
         { 
            ...newRequestService
         }
      );
   }
  
   const getEnterpriseServices = (companyId: bigint) => {
      /** Configuro los objetos de escucha */
      const pendingRef = ref(rtdb, 'servicios-empresariales/pendientes/' + companyId );
      const confirmRef = ref(rtdb, 'servicios-empresariales/confirmados/' + companyId );
      const historicRef = ref(rtdb, 'servicios-empresariales/historial/' + companyId );
      /** Servicios pendientes */
      onValue(pendingRef, (snapshot) => {
        if(snapshot.exists()){
         const arrayData : any[] = [];
         snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
         setPendingServices(arrayData);
        } else {
         setPendingServices([]);
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
   }    
   return { 
      saveEnterpriseService, 
      getEnterpriseServices, 
      pendingServices, 
      confirmedServices, 
      historicServices,
      services, 
      isLoading 
   }
}

