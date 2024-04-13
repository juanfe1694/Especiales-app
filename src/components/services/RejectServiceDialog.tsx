import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Button, Dialog, TextInput, useTheme } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons';
import { scheduleServiceCompany } from '../../interfaces/services/servicesInterfaces';
import { useAppSelector } from '../../app/hooks';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDriverEnterpriseService } from '../../hooks/useDriverEnterpriseService';
import Toast from 'react-native-root-toast';
import Modal from "react-native-modal";

type Detail = {
    title: string;
    reason: string;
    placeholder: string;
    label: string;
    onSuccessMessage: string;
    onErrorMessage: string;
}

type Props = {
    dialogVisible: boolean;
    closeDialog: () => void;
    openDialog: () => void;
    service: scheduleServiceCompany;
    rejectDetail: Detail
}

export const RejectServiceDialog = ({ closeDialog, openDialog, dialogVisible, service, rejectDetail }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const { theme: customTheme } = useAppSelector(state => state.theme);
    const theme = useTheme();
    const { rejectEnterpriseService, cancelEnterpriseService } = useDriverEnterpriseService();
    const { label, placeholder, reason, title, onSuccessMessage, onErrorMessage } = rejectDetail;
    const schema = yup.object({
        reasonForRejection: yup.string().required("Indique el motivo de rechazo")
    }).required();

    const {
        watch,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema)
      });
    const reasonForRejection = watch('reasonForRejection');
    const resEnterpriseService = label == 'Rechazar' ? rejectEnterpriseService : cancelEnterpriseService;

    const onSuccess = () => {
        closeDialog();
        Toast.show(onSuccessMessage, {
            duration: Toast.durations.LONG,
            });
    }

    const onError = () => {
        Toast.show(onErrorMessage, {
            duration: Toast.durations.LONG,
            });
    }
    
    
    const rejectService = (data: any) => {
        setIsLoading(true);
        const payload = {
            ...service,
            ...data
        }
        resEnterpriseService(payload)
            .then(onSuccess)
            .catch(onError)
            .finally(() => setIsLoading(false))
    }

  return (
    <View>
        <Modal
            avoidKeyboard
            isVisible={dialogVisible}
            onDismiss={closeDialog}
            backdropOpacity={0.3}
            onBackdropPress={closeDialog}
        >
            <View style={{borderRadius:10, backgroundColor: 'white', paddingTop: 20}}>
                <ScrollView>
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
                                {title}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={openDialog}>
                            <Ionicons name='close' size={25} style={{ marginRight:20}}  />
                            </TouchableOpacity>
                        </View>
                    </View> 
                    <Dialog.Content>
                        <View>
                            <Text>
                                A continuación ingrese el motivo de {reason}
                            </Text>
                            <Controller
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <TextInput
                                        contentStyle={{ fontSize: 14}}
                                        outlineStyle={{
                                        borderColor: customTheme.colors.border
                                        }}
                                        mode="outlined"
                                        multiline
                                        numberOfLines={3}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder={placeholder}
                                        underlineColorAndroid="black"
                                        autoCorrect
                                        onSubmitEditing={handleSubmit(rejectService)}
                                        activeOutlineColor='#002851'
                                    />
                                </>
                                )}
                                name="reasonForRejection"
                                defaultValue=""
                            />
                            {errors.reasonForRejection && <Text style={{color: '#d9362b', textAlign: 'right'}}>Indique el motivo de {reason}</Text>}
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button 
                            mode='outlined' 
                            style={{borderRadius: 5}} 
                            textColor='#6D6D6D' 
                            onPress={openDialog}
                            disabled={isLoading} 
                        > Regresar </Button>
                        <Button 
                            mode='contained'  
                            style={{borderRadius: 5}} 
                            onPress={handleSubmit(rejectService)} 
                            buttonColor={theme.colors.error}
                            loading={isLoading}
                            disabled={!(reasonForRejection?.length > 0)}
                        > {label} </Button>
                    </Dialog.Actions>
                </ScrollView>
            </View>
        </Modal>
    </View>
  )
}
