import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Linking,
    TouchableOpacity
} from "react-native";
import { loginStyles } from "./LoginStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { UserCredentialsFetch } from "../../interfaces/auth/authInterfaces";
import { RFPercentage } from "react-native-responsive-fontsize";
import { TextInput, Checkbox, ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginThunk } from "../../redux/thunks/security/authThunk";
import { useRemindUser } from "../../hooks/useRemindUser";
import Toast from "react-native-root-toast";
import { MainButton } from "../../app/custom-components/MainButton";
import { Link } from "@react-navigation/native";

export const LoginComponent = () => {
    const { isLoading, token } = useAppSelector(state => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [remindUser, setRemindUser] = useState(true);
    const dispatch = useAppDispatch();
    const { rememberUser, forgetUser } = useRemindUser();

    const schema = yup
        .object({
            usuario: yup.string().required("Ingrese tipo y número de documento"),
            clave: yup
                .string()
                .required("Ingrese una contraseña")
                .min(6, "min 6")
                .max(20, "max 20"),
        })
        .required();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<UserCredentialsFetch>({
        resolver: yupResolver(schema),
        defaultValues: {
            usuario: "",
            clave: ""
        },
    });

    const onSubmit = async (data: UserCredentialsFetch) => {
        const { usuario, clave } = data;
        remindUser ? rememberUser(usuario, clave) : forgetUser()
        try {
            await dispatch(loginThunk(data))
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'No se pudo autenticar el usuario'
            Toast.show(message, {
                duration: Toast.durations.LONG,
            });
        }

    };

    const iconoClave = () => (
        showPassword
            ? <TextInput.Icon icon="eye-off" onTouchEnd={() => setShowPassword(false)} />
            : <TextInput.Icon icon="eye" onTouchEnd={() => setShowPassword(true)} />
    )

    const handleOpenLink = () => {
        const url = 'https://fenixcarga.com/politica-de-privacidad-y-proteccion-de-datos-personales/';

        Linking.openURL(url);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled>
            <View style={loginStyles.container}>
                <View>
                    <ScrollView>
                        <View style={loginStyles.imageContainer}>
                            <Image
                                source={require('../../../assets/logos/Logo-especiales.jpg')}
                                style={loginStyles.image}
                            />
                        </View>
                        <View style={loginStyles.titleContainer}>

                            <Text style={loginStyles.title}>Bienvenido</Text>
                            <View style={{ flexDirection: "row", paddingBottom: 20 }}>
                                <Text
                                    style={[
                                        loginStyles.subTitle,
                                        { borderBottomColor: "#002851", borderBottomWidth: 3 },
                                    ]}
                                >
                                    Ingresa </Text>
                                <Text style={loginStyles.subTitle}>
                                    en tu cuenta registrada
                                </Text>
                            </View>

                            <Controller
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <TextInput
                                        mode="outlined"
                                        label="Usuario"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder="Ingrese su número de documento"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        activeOutlineColor='#002851'
                                    />
                                )}
                                name="usuario"
                                defaultValue=""
                            />

                            {errors.usuario && <Text>Ingrese su número de documento</Text>}

                            <Controller
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        mode="outlined"
                                        label="Clave"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder="Ingrese su clave"
                                        secureTextEntry={!showPassword}
                                        underlineColorAndroid="black"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        style={{ marginTop: RFPercentage(1.5) }}
                                        activeOutlineColor='#002851'
                                        right={iconoClave()}
                                    />
                                )}
                                name="clave"
                                defaultValue=""
                            />
                            {errors.clave && <Text>Ingrese una contraseña.</Text>}
                            <View style={{ alignItems: 'flex-start' }}>
                                <Checkbox.Item
                                    label="Mantener sesión iniciada"
                                    status={remindUser ? 'checked' : 'unchecked'}
                                    onPress={() => setRemindUser(!remindUser)}
                                    position="leading"
                                    style={{ marginLeft: -RFPercentage(3) }}
                                    color='#002851'
                                />
                            </View>
                            <View style={loginStyles.buttonsContainer}>

                                <MainButton
                                    isLoading={isLoading}
                                    label='Iniciar sesión'
                                    onLoadingLabel='Iniciando sesión'
                                    onPress={handleSubmit(onSubmit)}
                                />

                            </View>
                            <View style={{ alignItems: "center", marginTop: 15 }}>
                                <Text>
                                    Al ingresar estás aceptando nuestros
                                </Text>
                                <TouchableOpacity onPress={handleOpenLink}>
                                    <Text
                                        style={{ color: '#002851', textDecorationLine: 'underline' }}
                                    >
                                        términos y condiciones
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
