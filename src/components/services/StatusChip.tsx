import { View } from "react-native"
import { Chip } from "react-native-paper"

type Props = {
    state: string;
    color: string;
    background: string;
}
export const StatusChip = ({ state, color, background }: Props) => {

    return(
        <Chip 
            style={{ backgroundColor: background, marginRight: 8, marginTop: 5 }} 
            selectedColor= { color }
        >
            <View 
                style={{ 
                    backgroundColor: color,
                    height: 10,
                    width: 10,
                    borderRadius: 50
                }}
            >
            </View> 
            {' '}
            { state }
        </Chip>
    )
}