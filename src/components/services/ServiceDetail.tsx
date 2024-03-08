import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import {  Button, Dialog, Portal } from 'react-native-paper';
import { Text, TouchableOpacity, View } from 'react-native';
import { Vehicle, scheduleServiceCompany } from '../../interfaces/services/servicesInterfaces';
import { useDateTimeFormater } from '../../hooks/useDateTimeFormater';
import { cardStyles } from './cardStyles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useDriverEnterpriseService } from '../../hooks/useDriverEnterpriseService';
import { RejectServiceDialog } from './RejectServiceDialog';
import Toast from 'react-native-root-toast';
import { ActionDialog } from '../overlay/ActionDialog';
import { useAppSelector } from '../../app/hooks';

const initialRejectDetail = {
    title: 'Rechazar servicio', 
    reason: 'rechazo', 
    placeholder: 'Motivo de rechazo', 
    label: 'Rechazar',
    onSuccessMessage: 'Servicio rechazado',
    onErrorMessage: 'No se pudo rechazar el servicio'
}

const serviceCancelationDetail = {
    title: 'Cancelar servicio', 
    reason: 'cancelación', 
    placeholder: 'Motivo de cancelación', 
    label: 'Cancelar',
    onSuccessMessage: 'Servicio cancelado',
    onErrorMessage: 'No se pudo cancelar el servicio'
}

const endServiceDetail = {
    title: 'Finalizar servicio', 
    reason: "Ingrese las observaciones referentes al servicio en caso de ser necesario, de lo contrario ingrese 'sin comentarios'.", 
    placeholder: 'Observaciones del servicio', 
    label: 'Finalizar',
    errorMessage: 'Por favor ingrese una observación'
}

type Props = {
    dialogVisible: boolean;
    closeDialog: () => void;
    openDialog: () => void;
    service: scheduleServiceCompany;
    showActions?: boolean;
    showValueCompany?: boolean;
}

export const ServiceDetail = ({
    dialogVisible,
    closeDialog,
    openDialog,
    service, 
    showActions = false, 
    showValueCompany = false }: Props) => {

    const { userInfo } = useAppSelector(state => state.auth);
    const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rejectDetail, setrejectDetail] = useState(initialRejectDetail);
    const [endingService, setendingService] = useState(false);
    const [endServiceDialogVisible, setendServiceDialogVisible] = useState(false);
    const isDriver = userInfo.roles.includes("Conductor");

    const { 
        origin, 
        destination, 
        numberOfPassengers, 
        pickUpDate, 
        pickUpTime,
        returnDate,
        returnTime,
        requestState,
        driver,
        vehicle,
        valueThird, 
        valueCompany
    } = service;
    const { getFormatedDate, getFormatedTime } = useDateTimeFormater();
    const { resEnterpriseService, startEnterpriseService, endEnterpriseService } = useDriverEnterpriseService();
    const regVehicle = (vehicle as Vehicle)?.label;

    const onSuccess = () => {
        const message = 'Servicio confirmado'
        closeDialog();
        Toast.show(message, {
            duration: Toast.durations.LONG,
            });
    }

    const onError = () => {
        const message = 'No se pudo confirmar el servicio'
        Toast.show(message, {
            duration: Toast.durations.LONG,
            });
    }

    const confirmService = () => {
        setIsLoading(true);
        resEnterpriseService(service)
            .then(onSuccess)
            .catch(onError)
            .finally(() => setIsLoading(false))
    }

    const rejectService = () => {
        setRejectDialogVisible(true);
        closeDialog();
    }

    const closeRejectDialog = () => {
        setrejectDetail(initialRejectDetail);
        setRejectDialogVisible(false);
        openDialog();
    }

    const discardRejectDialog = () => {
        setRejectDialogVisible(false);
    }

    /** Start service */

    const onStartSuccess = () => {
        const message = 'Servicio iniciado'
        closeDialog();
        Toast.show(message, {
            duration: Toast.durations.LONG,
            });
    }

    const onStartError = () => {
        const message = 'No se pudo iniciar el servicio'
        Toast.show(message, {
            duration: Toast.durations.LONG,
            });
    }

    const startService = () => {
        setIsLoading(true);
        startEnterpriseService(service)
            .then(onStartSuccess)
            .catch(onStartError)
            .finally(() => setIsLoading(false))
    }

    const cancelService = () => {
        setrejectDetail(serviceCancelationDetail);
        setRejectDialogVisible(true);
        closeDialog();
    }

    /** End service */

    const onEndSuccess = () => {
        const message = 'Servicio finalizado'
        closeDialog();
        setendServiceDialogVisible(false);
        Toast.show(message, {
            duration: Toast.durations.LONG,
            });
    }

    const onEndError = () => {
        const message = 'No se pudo finalizar el servicio'
        Toast.show(message, {
            duration: Toast.durations.LONG,
            });
    }

    const endService = ({description} : {description?: string}) => {

        const driverObservations = description;
        setendingService(true);
        endEnterpriseService({...service, driverObservations})
            .then(onEndSuccess)
            .catch(onEndError)
            .finally(() => setendingService(false))

    }

    const displayConfirmDialog = () => {
        setendServiceDialogVisible(true);
        closeDialog();
    }

    const hideConfirmDialog = () => {
        setendServiceDialogVisible(false);
        openDialog();
    }


  return (
    <> 
        <Portal>
            <Dialog visible={dialogVisible} style={{borderRadius:10}} onDismiss={closeDialog}>
                <View  
                    style={{
                        display:'flex', 
                        flexDirection:'row', 
                        justifyContent:'space-between',
                        marginBottom: 15
                    }}
                >
                <View>
                    <Text style={{ marginLeft:20, fontSize: 20, fontWeight:'500' }}>
                    Detalle del servicio
                    </Text>
                </View>
                <View>
                    <TouchableOpacity onPress={closeDialog}>
                    <Ionicons name='close' size={25} style={{ marginRight:20}}  />
                    </TouchableOpacity>
                </View>
                </View>       
                <Dialog.Content>
                    <View>
                        <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                            <Text><Ionicons name='calendar' size={RFPercentage(2)} /> Fecha salida </Text>
                            <Text> { getFormatedDate(pickUpDate) } </Text>
                        </View>
                        <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                            <Text><Ionicons name='time' size={RFPercentage(2)} /> Hora salida </Text>
                            <Text> { getFormatedTime(pickUpTime) } </Text>
                        </View>
                        { (returnDate && returnTime) &&
                            <>
                                <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                                    <Text><Ionicons name='calendar' size={RFPercentage(2)} /> Fecha regreso </Text>
                                    <Text> { getFormatedDate(returnDate) } </Text>
                                </View>
                                <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                                    <Text><Ionicons name='time' size={RFPercentage(2)} /> Hora regreso </Text>
                                    <Text> { getFormatedTime(returnTime) } </Text>
                                </View>
                            </>
                        }
                        <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                            <Text><Ionicons name='people' size={RFPercentage(2)} /> # Pasajeros </Text>
                            <Text> { numberOfPassengers } </Text>
                        </View>
                        <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                            <Text><Ionicons name='location-sharp' size={RFPercentage(2)} /> Origen </Text>
                            <Text style={{flex: 1, textAlign:'right'}}> { origin.description } </Text>
                        </View>
                        <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                            <Text><Ionicons name='location-sharp' size={RFPercentage(2)} />  Destino </Text>
                            <Text style={{flex: 1, textAlign:'right'}}> { destination.description } </Text>
                        </View>
                        { driver &&
                            <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                                <Text><Ionicons name='man' size={RFPercentage(2)} />  Conductor </Text>
                                <Text style={{flex: 1, textAlign:'right'}}> { driver?.label } </Text>
                            </View>
                        }
                        { vehicle &&
                            <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                                <Text><Ionicons name='car-sport' size={RFPercentage(2)} />  Vehículo </Text>
                                <Text style={{flex: 1, textAlign:'right'}}> { regVehicle } </Text>
                            </View>
                        }
                            <View style={[cardStyles.cardRow,{marginHorizontal: 0}]}>
                                <Text><Ionicons name='wallet' size={RFPercentage(2)} />  Valor </Text>
                                <Text style={{flex: 1, textAlign:'right'}}> 
                                    $ { showValueCompany ? valueCompany : valueThird } 
                                </Text>
                            </View>
                    </View>
                </Dialog.Content>
                {/** Si el servicio está en estado Asignado, mostrar los botones */}
                { showActions &&
                    requestState == 'Asignado' ?
                        <Dialog.Actions>
                            <Button mode='outlined' style={{borderRadius: 5}} textColor='#6D6D6D' onPress={rejectService} disabled={isLoading}> Rechazar </Button>
                            <Button mode='contained'  style={{borderRadius: 5}} onPress={confirmService} loading={isLoading}> Confirmar </Button>
                        </Dialog.Actions>
                
                /** Si el servicio está en estado Confirmado, mostrar los botones */
                
                    : showActions && requestState == 'Confirmado' ?
                            <Dialog.Actions>
                                <Button mode='outlined' style={{borderRadius: 5}} textColor='#6D6D6D' onPress={cancelService} disabled={isLoading}> Cancelar </Button>
                                <Button mode='contained'  style={{borderRadius: 5}} onPress={startService} loading={isLoading}> Iniciar </Button>
                            </Dialog.Actions>
                
                /** Si el servicio está en estado transito, mostrar los botones */
                
                    : showActions && requestState == 'Transito' &&
                            <Dialog.Actions>
                            { /*<Button mode='outlined' style={{borderRadius: 5}} textColor='#6D6D6D' onPress={rejectService} disabled={isLoading}> Rechazar </Button>*/}
                                <Button mode='contained'  style={{borderRadius: 5}} onPress={displayConfirmDialog} loading={isLoading}> Finalizar </Button>
                            </Dialog.Actions>
                }
            </Dialog>
        </Portal>
        <RejectServiceDialog 
            dialogVisible={rejectDialogVisible}
            closeDialog={discardRejectDialog}
            openDialog={closeRejectDialog}
            service={service}
            rejectDetail={rejectDetail}
        />
        <ActionDialog 
            confirmAction={endService}
            discardAction={hideConfirmDialog}
            isLoading={endingService}
            dialogVisible={endServiceDialogVisible}
            detail={endServiceDetail}
        />
    </>
  )
}
