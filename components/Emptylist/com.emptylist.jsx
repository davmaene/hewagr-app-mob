import * as React from 'react';
import { View,Text } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Colors } from '../../assets/colors/Colors';

export const EmptyList = ({ options }) => {
    return(
        <View style={{ width: "80%", height: "auto", alignSelf: "center", marginVertical: 45 }}>
            <View style={{ alignSelf: "center", marginVertical: 12 }}>
                {/* <FontAwesome5 name="cloud-off" size={24} color="black" /> */}
                <Feather name="box" size={ Dims.bigiconsize } color={ Colors.primaryColor } />
            </View>
            <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Aucune information</Text>
            <Text style={{ textAlign: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Aucune information disponible à afficher pour le moment !</Text>
        </View>
    )
}