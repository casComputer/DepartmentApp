import { Chip } from '@expo/ui/jetpack-compose';
import { Text, TouchableOpacity, View } from 'react-native';

const StudentExtra = () => {
    return (
        <View style={{ flexDirection: "row" }}>

            <TouchableOpacity style={{
                backgroundColor: "white",
                borderRadius: 14,
                minWidth: 100,
                justifyContent: "center",
                alignItems: "center",

            }}>
                <Text style={{
                     color: "black",
                      fontWeight: "bold" 
                }}>
                    first year
                </Text>
            </TouchableOpacity>

            <Chip
                variant="filter"
                label="first year"
                style={{ height: 50 }}
                selected={true}

            />

        </View>
    )
}



export default StudentExtra