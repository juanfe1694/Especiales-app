import React, { useEffect, useState } from 'react'
import { useEnterpriseService } from '../../hooks/useEnterpriseService';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { View } from 'react-native';
import { BlankPage } from '../utilities/BlankPage';
import { Loading } from '../utilities/Loading';
import { ServicesTabs } from '../../components/services/ServicesTabs';
import { ServiceTabsItems } from '../../interfaces/services/servicesInterfaces';
import { setRequestState } from '../../redux/slices/services/companyServicesSlice';
import { Services } from '../../components/services/Services';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export const ServicesListScreen = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  const { requestState } = useAppSelector(state => state.services);
  const { 
    getEnterpriseServices, 
    confirmedServices, 
    historicServices,
    requestedServices, 
    activeServices,
    isLoading } = useEnterpriseService();
  const [tabsOptions, setTabsOptions] = useState<ServiceTabsItems[]>([
    {
      label: 'Pendientes',
      notification: false
    },
    {
      label: 'Confirmados',
      notification: false
    },
    {
      label: 'Historial',
      notification: false
    }
  ]);

  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    isFocused && dispatch(setRequestState('Pendientes'));
  }, [isFocused])

  useEffect(() => {
    getEnterpriseServices(userInfo.numeroDocumento)
  }, [userInfo])

  useEffect(() => {

    if( requestState != 'Confirmados' ){
      const currentTabs = [ ...tabsOptions ];
      const updatedTabs = currentTabs.map(current => {
        if(current.label == 'Confirmados'){
          return {
            ...current,
            notification: true
          }
        } else{
          return current;
        }
      }) 
        setTabsOptions(updatedTabs)
    }
  }, [confirmedServices])

  useEffect(() => {
    if( requestState != 'Historial' ){
      const currentTabs = [ ...tabsOptions ];
      const updatedTabs = currentTabs.map(current => {
        if(current.label == 'Historial'){
          return {
            ...current,
            notification: true
          }
        } else{
          return current;
        }
      }) 
        setTabsOptions(updatedTabs)
    }
    
  }, [historicServices])
  

  const onTabChange = (tabSelected: string) => {
    dispatch(setRequestState(tabSelected));
    switch (tabSelected) {
      case 'Confirmados':
        const currentTabs = [ ...tabsOptions ];
      const updatedTabs = currentTabs.map(current => {
        if(current.label == 'Confirmados'){
          return {
            ...current,
            notification: false
          }
        } else{
          return current;
        }
      }) 
        setTabsOptions(updatedTabs)
        
        break;
      case 'Historial':
        if( requestState != 'Historial' ){
          const currentTabs = [ ...tabsOptions ];
          const updatedTabs = currentTabs.map(current => {
            if(current.label == 'Historial'){
              return {
                ...current,
                notification: false
              }
            } else{
              return current;
            }
          }) 
            setTabsOptions(updatedTabs)
        }
        
        break;

      default:
        break;
    }
  }

  const getCurrentServices = (state: string) => {
    switch (state) {
      case 'Pendientes':
        return requestedServices;
      case 'Confirmados':
        return activeServices;
      case 'Historial':
        return historicServices;
      default:
        return requestedServices;
    }
  }

  return (
    <>
      {
        isLoading
          ? <Loading />
          : <> 
              <View style={{alignItems: 'center', marginVertical: 10}}>
                <ServicesTabs
                  items={tabsOptions}
                  action={onTabChange}
                />
              </View>
              
              {
                getCurrentServices(requestState).length
                      ? <Services services={getCurrentServices(requestState)} showValueCompany />
                      : <BlankPage />
              }  
            </>     
      }
    </>
  )
}
