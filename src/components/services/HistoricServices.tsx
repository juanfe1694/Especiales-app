import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { CardService } from './CardService'
import { BlankPage } from '../../screens/utilities/BlankPage'
import { ServiceDetail } from './ServiceDetail'

type Props = {
    services: any[];
}
export const HistoricServices = ({ services } : Props) => {

  const [dialogVisible, setdialogVisible] = useState(false);
  const [service, setservice] = useState(services[0]);

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
                          services?.map((service, index) => <CardService key={index} service={service} showDetail={showDialog}  />)
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
            /> 
        </>
    
      )
    }
