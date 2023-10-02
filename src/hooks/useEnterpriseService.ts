import { child, getDatabase, push, ref, set, onValue } from "firebase/database";
import { scheduleServiceCompany, serviceCompanyModel } from "../interfaces/services/servicesInterfaces";

import React, { useState } from 'react'
import { rtdb } from "../services/realtimeDBService";

export const useEnterpriseService = () => {

   const [services, setServices] = useState<any[]>([]);
   const [isLoading, setisLoading] = useState(true);

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
            'servicios-empresariales/' 
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
      const starCountRef = ref(rtdb, 'servicios-empresariales/' + companyId );
      onValue(starCountRef, (snapshot) => {
        if(snapshot.exists()){
         const arrayData : any[] = [];
         snapshot.forEach(( snap ) => { arrayData.push(snap.toJSON()) })
         setServices(arrayData);
        }
        setisLoading(false);
      }); 
   }    
  return { saveEnterpriseService, getEnterpriseServices, services, isLoading }
}

