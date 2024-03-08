import { child, push, ref, set, onValue, get, increment, update } from "firebase/database";
import { scheduleServiceCompany, serviceCompanyModel } from "../interfaces/services/servicesInterfaces";

import { useEffect, useState } from 'react'
import { rtdb } from "../services/realtimeDBService";

type Update = {
   [key: string]: object;
 };

export const useEnterpriseService = () => {

   const [pendingServices, setPendingServices] = useState<any[]>([]);
   const [asignedServices, setAsignedServices] = useState<any[]>([]);
   const [confirmedServices, setConfirmedServices] = useState<any[]>([]);
   const [inTransitServices, setInTransitServices] = useState<any[]>([]);
   const [historicServices, setHistoricServices] = useState<any[]>([]);
   const [requestedServices, setRequestedServices] = useState<any[]>([]);
   const [activeServices, setActiveServices] = useState<any[]>([]);
   const [isLoading, setisLoading] = useState(true);

   //const services = [...pendingServices, ...confirmedServices, ...historicServices ];

   useEffect(()=>{
      const requestedServices = [...pendingServices, ...asignedServices];
      setRequestedServices(requestedServices);
   },[pendingServices, asignedServices])

   useEffect(()=>{
      const activeServices = [...confirmedServices, ...inTransitServices];
      setActiveServices(activeServices);
   },[confirmedServices, inTransitServices])

   // Get all pending services
   const getCounter = async() => {
      const counterRef = ref(rtdb, 'servicios-empresariales/contador');
      const snapshot = await get(counterRef);
      const data = snapshot.val() || 0;
      const serviceNumber = data + 1;

      return serviceNumber;
   }

   const updateCounter = () => {
      const counterRef = ref(rtdb, 'servicios-empresariales/');
      let updates : Update = {};
      updates['contador'] = increment(1);
      const updateCounter = update(counterRef, updates);

      return updateCounter;
   }

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
            'servicios-empresariales/clientes/pendientes/' 
            + requestService.requester 
            + '/' 
            + newPostKey
         ), 
         { 
            ...newRequestService,
            serviceId: newPostKey
         }
      );
   }
  
   const getEnterpriseServices = (companyId: bigint) => {
      /** Configuro los objetos de escucha */
      const pendingRef = ref(rtdb, 'servicios-empresariales/clientes/pendientes/' + companyId );
      const asignedRef = ref(rtdb, 'servicios-empresariales/clientes/asignados/' + companyId );
      const confirmRef = ref(rtdb, 'servicios-empresariales/clientes/confirmados/' + companyId );
      const inTransitRef = ref(rtdb, 'servicios-empresariales/clientes/transito/' + companyId );
      const historicRef = ref(rtdb, 'servicios-empresariales/clientes/historial/' + companyId );
      /** Servicios pendientes */
      onValue(pendingRef, (snapshot) => {
        if(snapshot.exists()){
         const arrayData : any[] = [];
         snapshot.forEach(( snap ) => { 
            const value = snap.val();
            if(value.requestState == 'Rechazado'){
               value.requestState = 'Asignado';
               arrayData.push(value);
            } else {
               arrayData.push(snap.toJSON());
            }
         })
         setPendingServices(arrayData);
        } else {
         setPendingServices([]);
        }
        setisLoading(false);
      }); 
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
       });
       /** Servicios en transito */
      onValue(inTransitRef, (snapshot) => {
         if(snapshot.exists()){
          const arrayData : any[] = [];
          snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
          setInTransitServices(arrayData);
         } else {
            setInTransitServices([]);
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
      getCounter,
      updateCounter,
      saveEnterpriseService, 
      getEnterpriseServices, 
      pendingServices, 
      confirmedServices, 
      historicServices,
      //services, 
      requestedServices,
      activeServices,
      isLoading 
   }
}

