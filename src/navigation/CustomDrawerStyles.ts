import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const drawerStyles = StyleSheet.create({
    mainContainter: {
        flex: 1,
        padding: 15,
        paddingTop: RFPercentage(8)
    },
    imageContainter: {
        alignItems:'center',
        marginBottom: RFPercentage(2)
    },
    image: {
        width: RFPercentage(13),
        height: RFPercentage(13),
        padding: 10,
        aspectRatio: 1.4
    },
    moduleContainer:{
        marginBottom: 13
    },
    moduleText:{
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },
    permissionText:{
        padding: 10
    },
    permissionSelected:{
        backgroundColor: '#F9F9F9',
        color: '#002851',
        borderRadius: 10
    }
})