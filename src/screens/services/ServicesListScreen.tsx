import React, { useEffect, useState } from 'react'
import { useEnterpriseService } from '../../hooks/useEnterpriseService';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { View } from 'react-native';
import { BlankPage } from '../utilities/BlankPage';
import { Loading } from '../utilities/Loading';
import { ServicesTabs } from '../../components/services/ServicesTabs';
import { ServiceTabsItems } from '../../interfaces/services/servicesInterfaces';
import { PendingServices } from '../../components/services/PendingServices';
import { setRequestState } from '../../redux/slices/services/companyServicesSlice';
import { ActiveServices } from '../../components/services/ActiveServices';
import { HistoricServices } from '../../components/services/HistoricServices';

export const ServicesListScreen = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  const { requestState } = useAppSelector(state => state.services);
  const { 
    getEnterpriseServices, 
    pendingServices, 
    confirmedServices, 
    historicServices, 
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

  useEffect(() => {
    dispatch(setRequestState('Pendientes'));
  }, [])

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
                requestState == 'Pendientes' 
                  ? <PendingServices services={pendingServices} />
                  : requestState == 'Confirmados'
                    ? <ActiveServices services={confirmedServices} />
                    : requestState == 'Historial'
                      ? <HistoricServices services={historicServices} />
                      : <BlankPage />
              }  
            </>     
      }
    </>
  )
}
