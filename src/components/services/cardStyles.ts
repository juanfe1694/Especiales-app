import { StyleSheet } from 'react-native'

export const cardStyles = StyleSheet.create({
    card:{
        borderWidth:1,
        borderTopColor: '#D0D3D4',
        borderRightColor: '#D0D3D4',
        borderBottomColor: '#D0D3D4',
        borderRadius: 7,
        margin: 15
    },
    cardRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    stateContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10
    },
    hyperText:{
        textDecorationLine: 'underline'
    }
})