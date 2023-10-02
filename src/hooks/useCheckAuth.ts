import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { useAppDispatch } from '../app/hooks'
import { autentication } from '../redux/slices/security/authSlice';
import { authenticationThunk, loginThunk } from '../redux/thunks/security/authThunk';
import { useRemindUser } from './useRemindUser';
import { UserCredentialsFetch, userCredentials } from '../interfaces/auth/authInterfaces';


export const useCheckAuth = () => {

    const dispatch = useAppDispatch();
    const { getUser } = useRemindUser();
    
    useEffect(() => {
        checkAuthentication();
    }, [])
    
    const checkAuthentication = async () =>{
        try{
            const token = await AsyncStorage.getItem('Authorization');
            const memoizedUser: userCredentials | undefined = await getUser();
            
            if(!token){
                dispatch(autentication('unauthenticated'));
            } else if(memoizedUser){
                const {user, password} = memoizedUser;
                const userCredentials: UserCredentialsFetch = {
                    usuario: user as string,
                    clave: password as string
                }
                dispatch(loginThunk(userCredentials));
            } else{
                dispatch(authenticationThunk())
            }
        }catch(error: any){
            dispatch(autentication('unauthenticated'));
        }
    }

  return {checkAuthentication}
}
