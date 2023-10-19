import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { btn, inputGroup } from '../../assets/styles/Styles';
import { Divider } from 'react-native-paper';
import { onRunExternalRQST } from '../../services/communications';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import { appcompanyname, umergencyphonenumber } from '../../assets/configs/configs';
import * as Linking  from 'expo-linking';

export const SignupScreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);
    const [isFocusg, setIsFocusg] = React.useState(false);
    const [hosp ,sethosp] = React.useState({});
    const [gender, setgender] = React.useState("");
    const [genders, setgeders] = React.useState([]);
    const [hosps, sethops] = React.useState([]);
    const [temp, settemp] = React.useState([]);

    const onSubmit = () => {
        
    };

    React.useEffect(() => {
        setgeders(
            [
                { id: "Masculin", value: "Masculin" },
                { id: "Feminin", value: "Feminin" }
            ]
        )
    }, []);

    return(
        <>
            <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
                <Header colors={Colors.whiteColor} />
                <ScrollView 
                    contentContainerStyle={{ paddingBottom: "auto", backgroundColor: Colors.primaryColor }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ height: Dims.height - 200, borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor,  marginTop: Dims.smallradius }}>
                    <>
                        <View style={{ justifyContent: "center", marginTop: 40 }}>
                            <View style={{width: "90%", alignSelf: "center"}}>
                                <Text style={{ textAlign: "center", paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Compte ambassadeur</Text>
                                <Text style={{ textAlign: "center", alignSelf: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Un compte ambassadeur ne peut être crée que par un agent agrée de <Text>{appcompanyname}</Text> </Text>
                                <View style={{ marginTop: 20 }}>
                                    <TouchableHighlight
                                        underlayColor={ Colors.primaryColor }
                                        onPress={() => Linking.openURL(`tel:${umergencyphonenumber}`) }
                                        style={[btn, { flexDirection: "row" }]}
                                    >
                                        <>
                                            <Ionicons name='add-circle-outline' color={ Colors.whiteColor } />
                                            <Text style={{ fontFamily: "mons", paddingHorizontal: 10, color: Colors.whiteColor }}>Faire une démande de création de compte</Text>
                                        </>
                                    </TouchableHighlight>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <TouchableHighlight
                                        underlayColor={ Colors.pillColor }
                                        onPress={() => { navigation.navigate("signin") }}
                                        style={[btn, { backgroundColor: Colors.pillColor, flexDirection: "row" }]}
                                    >
                                        <>
                                            <Ionicons name='checkbox' color={ Colors.primaryColor } />
                                            <Text style={{ fontFamily: "mons", paddingHorizontal: 10, color: Colors.primaryColor }}>Je suis déjà ambassadeur | <Text>Connexion</Text></Text>
                                        </>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </>
                    </View>
                </ScrollView>
                <Footer/>
            </View>
        </>
    )
}