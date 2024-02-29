import React from 'react'
import { ScrollView, View } from 'react-native'
import { CardService } from './CardService'
import { BlankPage } from '../../screens/utilities/BlankPage'

type Props = {
    services: any[];
}
export const HistoricServices = ({ services } : Props) => {

  const showDetail = () => {

  }
    
    return (
        <>
            { 
                services?.length > 0
                  ? <View style={{flex: 1}}>
                      <ScrollView>
                        {
                          services?.map((service, index) => <CardService key={index} service={service} showDetail={showDetail} />)
                        }
                      </ScrollView>
                    </View>
                  : <BlankPage />
            }
        </>
    
      )
    }
