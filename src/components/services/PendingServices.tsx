import React from 'react'
import { ScrollView, View } from 'react-native'
import { CardService } from './CardService'
import { BlankPage } from '../../screens/utilities/BlankPage'

type Props = {
    services: any[];
}
export const PendingServices = ({ services } : Props) => {
    
  return (
    <>
        { 
            services?.length > 0
              ? <View style={{flex: 1}}>
                  <ScrollView>
                    {
                      services?.map((service, index) => <CardService key={index} {...service} />)
                    }
                  </ScrollView>
                </View>
              : <BlankPage />
        }
    </>

  )
}
