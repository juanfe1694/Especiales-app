import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { CardService } from './CardService'
import { BlankPage } from '../../screens/utilities/BlankPage'
import { ServiceDetail } from './ServiceDetail';

type Props = {
    services: any[];
    serviceId?: string;
    showActions?: boolean;
}

export const RejectedServices = ({ services, showActions = false} : Props) => {
  const [dialogVisible, setdialogVisible] = useState(false);
  const [service, setservice] = useState(services[0]);
    
  /*useEffect(() => {
    serviceId && showDialog(serviceId);
  }, [serviceId])*/

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
            />  
        </>
      )
    }
