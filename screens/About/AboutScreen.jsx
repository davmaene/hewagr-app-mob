import * as React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { appcompanyname, appname } from '../../assets/configs/configs';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';

export const AboutScreen = ({ navigation }) => {
    return(
        <>
            <Title 
                title={`A propos de ${appname}`} 
                subtitle={`Ce qu'il faut savoir sur ${appname}`} 
                navigation={navigation} 
            /> 
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
                <View style={{ padding: 20, alignSelf: "center" }}>
                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.bigtitletextsize, textAlign: "center" }}>A propos de {appname}</Text>
                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }} >{appname} est une application permettant une souscription des agriculteurs à des services cadrant avec l'agriculture entre autre les informations en temps réels sur la météo locale</Text>
                </View> 
                <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
                    <View style={{position: "absolute", bottom: "5%", width: "100%", backgroundColor: Colors.whiteColor, paddingVertical: 10, alignItems: "center", alignSelf: "center"}}>
                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.titletextsize, textAlign: "center" }}>{appname}</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, textAlign: "center" }}>{appname} App by {appcompanyname}</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, textAlign: "center" }}>{appname} {new Date().getFullYear()} | All rights reserved</Text>
                    </View> 
                    <Footer/>
                </View>
            </View>
        </>
    )
}