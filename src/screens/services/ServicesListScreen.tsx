import React, { useEffect } from 'react'
import { CardService } from '../../components/services/CardService'
import { useEnterpriseService } from '../../hooks/useEnterpriseService';
import { useAppSelector } from '../../app/hooks';
import { ScrollView, View } from 'react-native';
import { BlankPage } from '../utilities/BlankPage';
import { Loading } from '../utilities/Loading';

export const ServicesListScreen = () => {
  const { userInfo } = useAppSelector(state => state.auth)
  const { getEnterpriseServices, services, isLoading } = useEnterpriseService();

  useEffect(() => {
    getEnterpriseServices(userInfo.numeroDocumento)
  }, [userInfo])

  return (
    <>
      {
        isLoading
          ? <Loading />
          :  services?.length > 0
              ? <ScrollView>
                  {
                    services?.map((service, index) => <CardService key={index} {...service} />)
                  }
                </ScrollView>
              : <BlankPage />
      }
    </>
  )
}
