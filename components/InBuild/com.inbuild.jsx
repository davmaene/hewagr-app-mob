import * as React from 'react';
import { View,Text } from 'react-native';
import { FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Colors } from '../../assets/colors/Colors';

export const InBuild = ({ options }) => {
    
    return(
        <View style={{ width: "80%", height: "auto", alignSelf: "center", marginVertical: 45 }}>
            <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Comming Soon</Text>
            <Text style={{ textAlign: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Interface encore en construction</Text>
            <View style={{ alignSelf: "center", marginTop: 12 }}>
                {/* <FontAwesome5 name="cloud-off" size={24} color="black" /> */}
                {/* <Feather name="box" size={ Dims.bigiconsize } color={ Colors.primaryColor } /> */}
                <MaterialIcons name="query-builder" size={ Dims.bigiconsize } color={ Colors.primaryColor } />
            </View>
        </View>
    )
}