import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, View, FlatList } from 'react-native'
import { CardService } from './CardService'
import { BlankPage } from '../../screens/utilities/BlankPage'
import { ServiceDetail } from './ServiceDetail';
import { scheduleServiceCompany } from '../../interfaces/services/servicesInterfaces';

const initialService : scheduleServiceCompany = {
  numberOfPassengers: 0,
  destination:{ description:'', latitude:0, longitude:0 },
  origin:{ description:'', latitude:0, longitude:0 },
  pickUpDate: new Date(),
  pickUpTime: new Date(),
  returnDate: new Date(),
  returnTime: new Date(),
  serviceNumber: 0
}

type Props = {
    services: any[];
    serviceId?: string;
    showActions?: boolean;
    showValueCompany?: boolean;
}

export const Services = ({ services, serviceId, showActions = false , showValueCompany = false} : Props) => {
  const [dialogVisible, setdialogVisible] = useState(false);
  const [service, setservice] = useState(initialService);

  useEffect(() => {
    if(serviceId) {
      showDialog(serviceId)
    }
  }, [serviceId])

  const showDialog = (serviceId?: string) => {
    const service = services.find(x => x.serviceId == serviceId);
    if(service){
      setservice(service);
      setdialogVisible(true);
    }
  }

  const closeDialog = () => {
    setdialogVisible(false);
  }

  const openDialog = () => {
    setdialogVisible(true);
  }

    return (
        <>
            { 
                services?.length > 0
                  ? <View style={{flex: 1}}>
                      <ScrollView>
                        {
                          services?.map((x, index) => 
                          <CardService key={index} service={x} showDetail={showDialog} />)
                        }
                      </ScrollView>
                    </View>
                  : <BlankPage />
            }
              <ServiceDetail 
                dialogVisible={dialogVisible}
                closeDialog={closeDialog} 
                openDialog={openDialog}
                service={service}
                showActions={showActions}
                showValueCompany={showValueCompany}
              /> 
        </>
      )
    }
