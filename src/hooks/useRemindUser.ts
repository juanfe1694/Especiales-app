import * as SecureStore from 'expo-secure-store';

export const useRemindUser = () => {

    const rememberUser = async (user: string, password: string) => {
        try{
            await SecureStore.setItemAsync('user', user);
            await SecureStore.setItemAsync('password', password);
        }catch(error: any){ console.error }
    }
    
    const forgetUser = async () => {
        try{
            await SecureStore.deleteItemAsync('user');
            await SecureStore.deleteItemAsync('password');
        }catch(error: any){ console.error }
    }
    
    const getUser = async () => {
        try{
            let user = await SecureStore.getItemAsync('user');
            let password = await SecureStore.getItemAsync('password');
            return { user, password };
        }catch(error: any){ console.error }
    }

    return { rememberUser, forgetUser, getUser}
}