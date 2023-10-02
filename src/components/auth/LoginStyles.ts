import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const loginStyles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignContent: 'center'
    },
    titleContainer:{
        backgroundColor: 'white',
        paddingHorizontal: RFPercentage(3),
    },
    title:{
        fontWeight: 'bold',
        fontSize: RFPercentage(4)
    },
    subTitle:{
        fontSize: RFPercentage(2.5),
        backgroundColor: 'white'
    },
    label:{
        fontSize: RFPercentage(2.3)
    },
    inputField:{
        padding: RFPercentage(1),
        marginBottom: RFPercentage(1.5),
        fontSize: RFPercentage(1.7)
    },
    inputFieldIOS:{
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: RFPercentage(1)
    },
    forgotPasswordContainer:{
        alignItems: 'flex-end',
        marginBottom: RFPercentage(2.5)
    },
    forgotPassword:{
        fontSize: RFPercentage(2)
    },
    buttonsContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: RFPercentage(2)
    },

    loginButton:{
        flexDirection: 'row',
        backgroundColor: '#002851',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical:RFPercentage(1.8),
        paddingHorizontal: RFPercentage(2.5),
        width: '100%',
        borderRadius: 4
    },
    imageContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: RFPercentage(5)
    },
    image: {
        width: RFPercentage(20),
        height: RFPercentage(20),
        padding: 10,
        aspectRatio: 1.4
      },
})