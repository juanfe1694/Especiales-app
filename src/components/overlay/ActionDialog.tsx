import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Button, Dialog, Portal, TextInput, useTheme } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons';
import { scheduleServiceCompany } from '../../interfaces/services/servicesInterfaces';
import { useAppSelector } from '../../app/hooks';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type Detail = {
    title: string;
    reason: string;
    placeholder: string;
    label: string;
    errorMessage: string;
}

type Props = {
    dialogVisible: boolean;
    confirmAction: (args?: any) => any;
    discardAction: (args?: any) => any;
    detail: Detail
    isLoading: boolean;
}

export const ActionDialog = ({ isLoading, dialogVisible, detail, confirmAction, discardAction }: Props) => {
    const { theme: customTheme } = useAppSelector(state => state.theme);
    const theme = useTheme();
    const { label, placeholder, reason, title, errorMessage } = detail;
    const schema = yup.object({
        description: yup.string().required(errorMessage)
    }).required();

    const {
        watch,
        setValue,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema)
      });
    const description = watch('description');

    useEffect(() => {
        dialogVisible && setValue('description', '');
    }, [dialogVisible])
    
  return (
    <Portal>
        <Dialog visible={dialogVisible} style={{borderRadius:10}} onDismiss={discardAction}>
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
                <TouchableOpacity onPress={discardAction}>
                <Ionicons name='close' size={25} style={{ marginRight:20}}  />
                </TouchableOpacity>
            </View>
            </View>       
            <Dialog.Content>
                <View>
                    <Text style={{marginBottom:5}}>
                         {reason}
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
                                numberOfLines={5}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder={placeholder}
                                underlineColorAndroid="black"
                                autoCorrect
                                onSubmitEditing={handleSubmit(confirmAction)}
                                activeOutlineColor='#002851'
                            />
                        </>
                        )}
                        name="description"
                        defaultValue=""
                    />
                    {errors.description && <Text style={{color: '#d9362b', textAlign: 'right'}}>{errorMessage}</Text>}
                </View>
            </Dialog.Content>
            <Dialog.Actions>
                <Button 
                    mode='outlined' 
                    style={{borderRadius: 5}} 
                    textColor='#6D6D6D' 
                    onPress={discardAction}
                    disabled={isLoading} 
                > Regresar </Button>
                <Button 
                    mode='contained'  
                    style={{borderRadius: 5}} 
                    onPress={handleSubmit(confirmAction)} 
                    loading={isLoading}
                    disabled={!(description?.length > 0)}
                > {label} </Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
  )
}
