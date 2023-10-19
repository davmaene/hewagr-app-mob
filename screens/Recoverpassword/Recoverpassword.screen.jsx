import * as React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { appcompanyname, umergencyphonenumber } from '../../assets/configs/configs';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { btn } from '../../assets/styles/Styles';
import { Dims } from '../../assets/dimensions/Dimemensions';
import * as Linking  from 'expo-linking';

export const Recoverpassword = ({ navigation, route }) => {
    
    return(
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
            <Header colors={Colors.primaryColor} />
            <View style={{width: "90%", alignSelf: "center"}}>
                <Text style={{ textAlign: "center", paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Compte ambassadeur | Restauration mot de passe</Text>
                <Text style={{ textAlign: "center", alignSelf: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>
                    Pour restaurez votre mot de passe vous devez passer au bureau de  <Text style={{ fontFamily: "mons", color: Colors.primaryColor }} >{appcompanyname}</Text> | Ou vous pouvez tout simplement nous contacter au numéro 
                    <Text style={{ fontFamily: "mons", color: Colors.primaryColor }} > {umergencyphonenumber}</Text>
                </Text>
                <View style={{ marginTop: 20 }}>
                    <TouchableHighlight
                        underlayColor={ Colors.primaryColor }
                        onPress={() => Linking.openURL(`tel:${umergencyphonenumber}`) }
                        style={[btn, { flexDirection: "row" }]}
                    >
                        <>
                            <Ionicons name='call-outline' color={ Colors.whiteColor } />
                            <Text style={{ fontFamily: "mons", paddingHorizontal: 10, color: Colors.whiteColor }}>Appeler le service client </Text>
                        </>
                    </TouchableHighlight>
                </View>
            </View>
            <Footer />
        </View>
    )
}