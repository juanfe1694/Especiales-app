import React from 'react'
import { useAppDispatch } from '../app/hooks';
import { useRemindUser } from './useRemindUser';
import { UserCredentialsFetch, userCredentials } from '../interfaces/auth/authInterfaces';
import { loginThunk } from '../redux/thunks/security/authThunk';
import { autentication } from '../redux/slices/security/authSlice';

export const useRenewExpiredToken = () => {
    const dispatch = useAppDispatch();
    const { getUser } = useRemindUser();

    const authUser = async () => {
        const memoizedUser: userCredentials | undefined = await getUser();
            
        if(memoizedUser){
            const {user, password} = memoizedUser;
            const userCredentials: UserCredentialsFetch = {
                usuario: user as string,
                clave: password as string
            }
            dispatch(loginThunk(userCredentials));
        }else{
            dispatch(autentication('unauthenticated'))
        }
    }
    
  return { authUser }
}
