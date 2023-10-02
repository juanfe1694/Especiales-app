import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { loginStyles } from '../../components/auth/LoginStyles';
import { RFPercentage } from 'react-native-responsive-fontsize';


type Props = {
    onPress: (action?: any) => void;
    isLoading: boolean;
    label: string;
    onLoadingLabel: string;
}

export const MainButton = ({ onPress, isLoading, label, onLoadingLabel } : Props) => {
  return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={ onPress }
            style={[loginStyles.loginButton,{opacity: isLoading ? 0.5 : 1 }]}
            disabled={isLoading}
        >
            { !isLoading 
                ?   (
                        <Text style={{ color: "white", fontWeight:'500',  fontSize: RFPercentage(2.5), marginRight: 3 }}>
                            { label }
                        </Text>
                    )
                :   (
                        <>
                            <Text style={{ color: "white", fontWeight:'500',  fontSize: RFPercentage(2.5), marginRight: 3 }}>
                                { onLoadingLabel }
                                {" "}
                            </Text>
                            <ActivityIndicator animating={true} color="white" size={"small"} />
                        </>
                    )
                        }
        </TouchableOpacity>
  )
}
