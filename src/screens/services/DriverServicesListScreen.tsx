import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { View } from 'react-native';
import { BlankPage } from '../utilities/BlankPage';
import { Loading } from '../utilities/Loading';
import { ServicesTabs } from '../../components/services/ServicesTabs';
import { ServiceTabsItems } from '../../interfaces/services/servicesInterfaces';
import { setRequestState } from '../../redux/slices/services/companyServicesSlice';
import { ActiveServices } from '../../components/services/ActiveServices';
import { HistoricServices } from '../../components/services/HistoricServices';
import { useDriverEnterpriseService } from '../../hooks/useDriverEnterpriseService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RejectedServices } from '../../components/services/RejectedServices';

export const DriverServicesListScreen = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  const { requestState } = useAppSelector(state => state.services);
  const { 
    getEnterpriseServices, 
    confirmedServices, 
    historicServices, 
    rejectedServices,
    currentServices,
    isLoading } = useDriverEnterpriseService();
  const [tabsOptions, setTabsOptions] = useState<ServiceTabsItems[]>([
    {
      label: 'Activos',
      notification: false
    },
    {
      label: 'Historial',
      notification: false
    },
    {
      label: 'Rechazados',
      notification: false
    }
  ]);

  const dispatch = useAppDispatch();
  const route = useRoute();
  const serviceId = route.params?.serviceId;
  const navigation = useNavigation();
  
  useEffect(() => {
    dispatch(setRequestState('Activos'));
  }, [])

  useEffect(() => {
    getEnterpriseServices(userInfo.numeroDocumento)
  }, [userInfo])
/*
  useEffect(() => {

    if( requestState != 'Activos' ){
      const currentTabs = [ ...tabsOptions ];
      const updatedTabs = currentTabs.map(current => {
        if(current.label == 'Activos'){
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
  }, [requestState, currentServices])

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
    
  }, [requestState, historicServices])

  useEffect(() => {
    if( requestState != 'Rechazados' ){
      const currentTabs = [ ...tabsOptions ];
      const updatedTabs = currentTabs.map(current => {
        if(current.label == 'Rechazados'){
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
    
  }, [requestState, rejectedServices])

*/

  const onTabChange = (tabSelected: string) => {
    serviceId && navigation.setParams({ serviceId: undefined });
    dispatch(setRequestState(tabSelected));
    switch (tabSelected) {
      case 'Activos':
        const currentTabs = [ ...tabsOptions ];
      const updatedTabs = currentTabs.map(current => {
        if(current.label == 'Activos'){
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
        case 'Rechazados':
          if( requestState != 'Rechazados' ){
            const currentTabs = [ ...tabsOptions ];
            const updatedTabs = currentTabs.map(current => {
              if(current.label == 'Rechazados'){
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
                 requestState == 'Activos'
                    ? <ActiveServices services={currentServices} serviceId={serviceId}/>
                    : requestState == 'Historial'
                      ? <HistoricServices services={historicServices} />
                      : requestState == 'Rechazados'
                        ? <RejectedServices services={rejectedServices} />
                        : <BlankPage />
              }  
            </>     
      }
    </>
  )
}
