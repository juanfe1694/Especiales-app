import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { scheduleServiceCompany } from '../../interfaces/services/servicesInterfaces';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Dialog, Portal, Searchbar } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDateTimeFormater } from '../../hooks/useDateTimeFormater';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { MainButton } from '../../app/custom-components/MainButton';
import { Address } from '../../interfaces/locations/locationInterfaces';
import { Map } from '../../components/maps/Map';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEnterpriseService } from '../../hooks/useEnterpriseService';
import { DrawerParamList } from '../../../types';
import { setRequestState } from '../../redux/slices/services/companyServicesSlice';


export const ScheduleCompanyServiceForm = () => {

    /** Estilos visuales globales */
    const { theme } = useAppSelector(state => state.theme);

    const { userInfo } = useAppSelector(state => state.auth);

    /** Propiedades del selector de ubicación */
    const [dialogVisible, setdialogVisible] = useState(false);
    const [searchQuery, setsearchQuery] = useState('');
    
    /** Valores de los campos de fecha */
    const [inputField, setinputField] = useState('');
    const [timeField, settimeField] = useState('');

    /** Fecha de salida */
    const [minPickUpDate, setminPickUpDate] = useState(new Date());
    const [pickUpdate, setPickUpdate] = useState(new Date());
    const [pickUpDateString, setpickUpDateString] = useState('Fecha');
    const [showDatePicker, setshowDatePicker] = useState(false);

    /** Fecha de regreso */
    const [minReturnDate, setminReturnDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [returnDateString, setReturnDateString] = useState('Fecha');
    const [showReturnDatePicker, setshowReturnDatePicker] = useState(false);

    /** Variables de tiempo */
    const [showTimePicker, setshowTimePicker] = useState(false);
    const [time, settime] = useState(new Date());
    const [pickUpTime, setpickUpTime] = useState('Hora');
    const [returnTime, setreturnTime] = useState('Hora');
    
    /** Variable de viaje doble */
    const [viajeDoble, setviajeDoble] = useState(false);

    /** Estado del bontón de enviar */
    const [savingForm, setSavingForm] = useState(false);

    /** Propiedades del mapa */
    const [showAddressSelector, setshowAddressSelector] = useState(false);
    const [location, setlocation] = useState<Address>();

    const { convertTo12HourFormat } = useDateTimeFormater();

    /** Propiedades para la animacion al mostrar el input */
    const DURATION = 1000;
    const DELAY = 10;
    const opacity = useSharedValue(0);
    
    const locations : Address[] = [
      {
        description: "Loma linda",
        latitude: 0,
        longitude: 0
      },
      {
        description: "El dorado",
        latitude: 0,
        longitude: 0
      },
      {
        description: "Comfama",
        latitude: 0,
        longitude: 0
      },
    ]

    const [filteredLocations, setfilteredLocations] = useState(locations);
    const navigation = useNavigation<NavigationProp<DrawerParamList>>();
    const { saveEnterpriseService } = useEnterpriseService();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
      location && onSetLocation(location)
    }, [location])
    
    useEffect(() => {
      !showAddressSelector &&
      navigation.setOptions({
        title: 'Programar servicio',
        headerRight: () =>  <></>
      });
    }, [showAddressSelector])
    

    const schema = yup
    .object({
      origin: yup.object().required("Ingrese lugar de origen"),
      destination: yup.object().required("Ingrese lugar de destino"),
      pickUpDate: yup.date().required("Ingrese fecha/hora de salida"),
      numberOfPassengers: yup.number().required("Ingrese cantidad de pasajeros"),
      pickUpTime: yup.date().required("Ingrese fecha/hora de regreso"),
      
      /** Validación de returnDate de manera condicional */
      returnDate: yup.date()
        .test(
          'is-return-date-required', 
          'Ingrese fecha / hora de regreso', 
          function (value) {
            if (viajeDoble) {
              return value !== undefined;
            }
            /** No se requiere validación si doubleTrip no está seleccionado */ 
            return true; 
          }),

      returnTime: yup.date()
        .test(
          'is-return-time-required',
           'Ingrese fecha / hora de regreso', 
           function (value) {
            if (viajeDoble) {
              return value !== undefined;
            }
            /** No se requiere validación si doubleTrip no está seleccionado */ 
            return true; 
          }),
      
    }).required();

    const {
        watch,
        getFieldState,
        getValues,
        setValue,
        handleSubmit,
        control,
        formState: { errors },
      } = useForm<scheduleServiceCompany>({
        resolver: yupResolver(schema),
          defaultValues: {
            origin: {} as Address,
            destination: {} as Address
        },
      });

      const onSubmit = async (data: scheduleServiceCompany) => {
        try {
          setSavingForm(true);
          saveEnterpriseService({
            ...data, 
            requester:  userInfo.numeroDocumento,
            requesterName: userInfo.nombres + ' ' + userInfo.apellidos,
            requestState: 'Pendiente',
          });
          dispatch(setRequestState('Pendientes'));
          const message =  'Solicitud registrada exitosamente'
            Toast.show(message, {
                duration: Toast.durations.LONG,
                });
          navigation.navigate('ServicesListScreen');
        } catch (error: any) {
          console.log(error)
            const message = error?.response?.data?.message ?? 'No se pudo solicitar el servicio'
            Toast.show(message, {
                duration: Toast.durations.LONG,
                });
        } finally { setSavingForm(false) }
        
      };

      const onChangeSearch = (query : string) => {
        if(query.length > 0){
          
          const filteredLocations = locations.filter(x => x.description.toLowerCase().includes(query.toLowerCase()));
          setfilteredLocations(filteredLocations);
        }else{
          setfilteredLocations(locations);
        }
        setsearchQuery(query)
      };

      const showLocationSelector = (inputField: string) =>{
        setdialogVisible(true);
        setinputField(inputField);
      }

      const onSetLocation = (value: Address) => {
        setdialogVisible(false);
        switch (inputField) {
          case 'origin':
            setValue('origin', value);
            break;
          case 'destination':
            setValue('destination', value);
            break;
          default:
            break;
        }
      }

      const dateFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };

      const onSelectPickUpDate = (event: DateTimePickerEvent, date?: Date | undefined) => {
        
        const currentDate = date as Date;
            setshowDatePicker(false);
            setValue('pickUpDate', currentDate);
            setPickUpdate(currentDate);
            setpickUpDateString(currentDate.toLocaleDateString('es-ES', dateFormat))
            setminReturnDate(currentDate);
      }

      const onSelectReturnDate = (event: DateTimePickerEvent, date?: Date | undefined) => {
        
        const currentDate = date as Date;

            setshowReturnDatePicker(false);
            setReturnDate(currentDate);
            setReturnDateString(currentDate.toLocaleDateString('es-ES', dateFormat))
            setValue('returnDate', currentDate);

      }

      const onTimeSelect = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {

        const currentDate  = selectedDate as Date;
        const formatedDate = convertTo12HourFormat(currentDate.toString());
  
        setshowTimePicker(false);

        switch (timeField) {
          case "pickUp":
            setValue('pickUpTime', currentDate);
            setpickUpTime(formatedDate)
            break;

          case "return":
            setreturnTime(formatedDate)
            setValue('returnTime', currentDate);
            break;
        
          default:
            break;
        }
      };

      const handleShowTimePicker = (dateField: string) => {
        settimeField(dateField);
        setshowTimePicker(true);
      }

  const showHiddenInput = () => {
    if (viajeDoble) {
      //ocultar
      opacity.value = withTiming(0, { duration: DURATION });
      setReturnDateString('Fecha');
      setreturnTime('Hora');
      setValue('returnDate', undefined);
      setValue('returnTime', undefined)

    } else {
      //mostrar
      opacity.value = withTiming(1, { duration: DURATION });
    }

    setviajeDoble(!viajeDoble);
  };

  /** Función del mapa */
  const onLocationChange = ( location: Address ) => {
    setlocation(location);
    setshowAddressSelector(false);
  }
       
  return (
    <>
      {
        showAddressSelector
        ? <Map 
            onLocationChange={onLocationChange} 
            setshowAddressSelector={setshowAddressSelector} 
          />
        : <View style={{padding: RFPercentage(2)}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <Text>
                        <Text style={{color: '#d9362b'}}>* </Text> 
                        Origen
                      </Text>
                      <TouchableOpacity
                        onPress={() => showLocationSelector('origin')}
                        activeOpacity={0.6}
                        style={{
                          ...styles.inputButton,
                          borderWidth: 1,
                          borderColor: theme.colors.border
                        }}
                      >
                        <Text> 
                          <Ionicons name='location-outline' size={RFPercentage(2)} />
                          {" "}
                          { value.description || 'Seleccione el origen' }
                        </Text>
                      </TouchableOpacity>
                    </> 
                  )}
                  name="origin"
              />
              {errors.origin && <Text style={styles.errorText}>Ingrese lugar de origen</Text>}
              <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <Text>
                        <Text style={{color: '#d9362b'}}>* </Text> 
                        Destino
                      </Text>
                      <TouchableOpacity
                        onPress={() => showLocationSelector('destination')}
                        activeOpacity={0.6}
                        style={{
                          ...styles.inputButton,
                          borderWidth: 1,
                          borderColor: theme.colors.border
                        }}
                      >
                        <Text> 
                          <Ionicons name='location-outline' size={RFPercentage(2)} />
                          {" "}
                          { value.description || 'Seleccione el destino' }
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                  name="destination"
              />
              {errors.destination && <Text style={styles.errorText}>Ingrese lugar de destino</Text>}

              {/** Contenedor de campos de fecha y hora personalizados fecha salida */}
              <View style={styles.dateTimeContainer}>
                <Text style={{marginBottom: RFPercentage(1)}}>
                  <Text style={{color: '#d9362b'}}>* </Text> 
                  Fecha inicial 
                </Text>
                <View  style={{flexDirection: 'row'}} >
                  <Controller
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value } }) => (
                          <TouchableOpacity
                            onPress={() => setshowDatePicker(true)}
                            activeOpacity={0.6}
                            style={{
                              ...styles.inputDateButtonLeft,
                              borderColor: theme.colors.border,
                            }}
                          >
                            <Text> 
                              <Ionicons name='calendar-outline' size={RFPercentage(2)} /> 
                              {" "}
                              { pickUpDateString }
                            </Text>
                          </TouchableOpacity>
                      )}
                      name="pickUpDate"
                      defaultValue={undefined}
                  />

                  <Controller
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value } }) => (
                          <TouchableOpacity
                            onPress={() => handleShowTimePicker('pickUp')}
                            activeOpacity={0.6}
                            style={{
                              ...styles.inputDateButtonRight,
                              borderColor: theme.colors.border
                            }}
                          >
                            <Text> 
                              <Ionicons name='time-outline' size={RFPercentage(2)} />  
                              {" "}
                              { pickUpTime } 
                            </Text>
                          </TouchableOpacity>
                      )}
                      name="pickUpTime"
                  />
                  
                </View>
                {
                    (errors.pickUpDate || errors.pickUpTime) 
                    && <Text style={{...styles.errorText, marginTop: 10}}> Seleccione fecha / hora salida </Text>
                }
              </View>

              {/** Contenedor de campos de fecha y hora personalizados retorno */}
              <Animated.View
                style={{
                  opacity: opacity
                }}
              >
              { viajeDoble &&
              
                (<View style={{ ...styles.dateTimeContainer, marginTop: RFPercentage(1.8)}}>
                  <Text style={{marginBottom: RFPercentage(1)}}> Fecha regreso </Text>
                  <View  style={{flexDirection: 'row'}} >
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TouchableOpacity
                              onPress={() => setshowReturnDatePicker(true)}
                              activeOpacity={0.6}
                              style={{
                                ...styles.inputDateButtonLeft,
                                borderColor: theme.colors.border,
                              }}
                            >
                              <Text> 
                                <Ionicons name='calendar-outline' size={RFPercentage(2)} /> 
                                {" "}
                                { returnDateString }
                              </Text>
                            </TouchableOpacity>
                        )}
                        name="returnDate"
                    />

                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TouchableOpacity
                              onPress={() => handleShowTimePicker('return')}
                              activeOpacity={0.6}
                              style={{
                                ...styles.inputDateButtonRight,
                                borderColor: theme.colors.border
                              }}
                            >
                              <Text> 
                                <Ionicons name='time-outline' size={RFPercentage(2)} />  
                                {" "}
                                { returnTime } 
                              </Text>
                            </TouchableOpacity>
                        )}
                        name="returnTime"
                    />
                  </View>
                  {
                    (errors.returnDate || errors.returnTime) 
                    && <Text style={{...styles.errorText, marginTop: 10}}> Seleccione fecha / hora regreso </Text>
                }
                </View>)
                
              }
              </Animated.View>

              {/** Selector viaje doble */}
              <View style={{alignItems:'flex-start'}}>
                  <Checkbox.Item 
                      label="Viaje doble" 
                      status={ viajeDoble ? 'checked' : 'unchecked' } 
                      onPress={() => showHiddenInput()}
                      position="leading" 
                      labelStyle={{fontSize: 14}}
                      style={{marginLeft: -RFPercentage(3)}}
                      color='#002851'
                  />
              </View>

              {/** Numero de pasajeros */}
              <View style={{marginBottom: RFPercentage(1.8)}}>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <Text>
                        <Text style={{color: '#d9362b'}}>* </Text> 
                          Número de pasajeros 
                        </Text>
                        <TextInput
                            contentStyle={{ fontSize: 14}}
                            outlineStyle={{
                              borderColor: theme.colors.border
                            }}
                            keyboardType='number-pad'
                            mode="outlined"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={ value?.toString() }
                            placeholder="Ingrese número de pasajeros"
                            underlineColorAndroid="black"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onSubmitEditing={handleSubmit(onSubmit)}
                            activeOutlineColor='#002851'
                        />
                      </>
                    )}
                    name="numberOfPassengers"
                />
                {
                errors.numberOfPassengers
                      && <Text style={{...styles.errorText, marginTop: 10}}> Ingrese número de pasajeros </Text>
                }
              </View>

              {/** Centro de costos */}
              <View style={{marginBottom: RFPercentage(1.8)}}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <Text>
                          Centro de costos 
                        </Text>
                        <TextInput
                            contentStyle={{ fontSize: 14}}
                            outlineStyle={{
                              borderColor: theme.colors.border
                            }}
                            mode="outlined"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            placeholder="Ingrese centro de costos"
                            underlineColorAndroid="black"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onSubmitEditing={handleSubmit(onSubmit)}
                            activeOutlineColor='#002851'
                        />
                      </>
                    )}
                    name="costCenter"
                    defaultValue=""
                />
              </View>

              {/** Código SAP*/}
              <View style={{marginBottom: RFPercentage(1.8)}}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <Text>
                          Código SAP 
                        </Text>
                        <TextInput
                            contentStyle={{ fontSize: 14}}
                            outlineStyle={{
                              borderColor: theme.colors.border
                            }}
                            mode="outlined"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            placeholder="Ingrese codigo SAP"
                            underlineColorAndroid="black"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onSubmitEditing={handleSubmit(onSubmit)}
                            activeOutlineColor='#002851'
                        />
                      </>
                    )}
                    name="SAPCode"
                    defaultValue=""
                />
              </View>

              {/** Boton para enviar formulario */}
              <View style={{marginVertical:RFPercentage(2)}}>
                <MainButton
                  isLoading={ savingForm }
                  label='Programar servicio'
                  onLoadingLabel='Programando servicio'
                  onPress={handleSubmit(onSubmit)}
                />
              </View>

              { /** Selector de fecha inicial */ }
              {showDatePicker && (
                <DateTimePicker
                  minimumDate={minPickUpDate}
                  value={pickUpdate}
                  mode='date'
                  onChange={onSelectPickUpDate}
                />
              )}

              { /** Selector de fecha de retorno */ }
              {showReturnDatePicker && (
                <DateTimePicker
                  minimumDate={minReturnDate}
                  value={returnDate}
                  mode='date'
                  onChange={onSelectReturnDate}
                />
              )}

              {/** Selector de hora */}
              {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode='time'
                    is24Hour={false}
                    onChange={onTimeSelect}
                  />
                )}

              { /** Dialogo para selección de ubicaciones */}
              <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setdialogVisible(false)}>
                  <Dialog.Title style={{fontSize: RFPercentage(2.5), fontWeight: 'bold'}}> Seleccione una ubicación </Dialog.Title>
                  <Dialog.ScrollArea>
                    <>
                      <Searchbar
                        placeholder="Buscar"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                      />
                      <ScrollView 
                        contentContainerStyle={{paddingHorizontal: 24}}
                        style={{height: RFPercentage(25)}}
                      >
                        {
                          filteredLocations.map((location) => 
                            <TouchableOpacity
                              onPress={() => onSetLocation(location)}
                              key={location.description}
                              activeOpacity={0.6}
                              style={{
                                ...styles.locationItem
                              }}
                            >
                                <Text> { location.description } </Text>
                            </TouchableOpacity>
                          )
                          
                        }
                      </ScrollView>
                    </>
                  </Dialog.ScrollArea>
                  <Dialog.Actions>
                    <Button 
                      icon={'map-marker'} 
                      onPress={() => setshowAddressSelector(true)}
                    >
                      Buscar en el mapa
                    </Button>
                    <Button onPress={() => setdialogVisible(false)}>Cerrar</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </ScrollView>
          </View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  inputButton:{
    width: '100%',
    padding: RFPercentage(2),
    borderRadius: 5,
    marginBottom: RFPercentage(1.8),
    marginTop: RFPercentage(1),
  },
  inputDateButtonLeft:{
    width: '50%',
    padding: RFPercentage(2),
    borderLeftWidth:1,
    borderTopWidth:1,
    borderBottomWidth: 1,
    borderRightWidth: 0.3,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  inputDateButtonRight:{
    width: '50%',
    padding: RFPercentage(2),
    borderRightWidth:1,
    borderTopWidth:1,
    borderBottomWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  dateTimeContainer:{
    width: '100%',
    marginVertical: RFPercentage(1),
  },
  locationItem:{
    padding: RFPercentage(1),
  },
  errorText:{
    color: '#d9362b', 
    textAlign: 'right'
  }
})