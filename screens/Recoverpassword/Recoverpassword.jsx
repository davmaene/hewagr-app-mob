import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard, TouchableHighlightBase, Linking, SafeAreaView } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { btn, buttons, dividerStyle, inputGroupForLoginOnly } from '../../assets/styles/Styles';
import { Divider } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { onRunExternalRQST, onRunInsertQRY } from '../../services/communications';
import DialogBox from 'react-native-dialogbox';
import NetInfos from '@react-native-community/netinfo';
import { Loader } from '../../components/Loader/comp.loader';

export const Recoverpasswordscreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [num, setnum] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [eye, seteye] = React.useState(true);
    const [output, setoutput] = React.useState("");
    const ref = React.useRef();

    const onSubmit = async () => {
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                setoutput("");
                if(num.length > 0){
                    if(password.length >= 0){
                        setisloading(true)
                        try {
                            onRunExternalRQST({
                                method: "PUT",
                                url: "/ambassadeurs/ambassadeur/resendcode",
                                data: {
                                    email: num
                                }
                            }, (err, done) => {
                                
                                if(done){
                                    setisloading(false)
                                    switch (done['status']) {
                                        case 200:
                                            navigation.replace("verifyaccountonforgotenpassword", { item: done['data'] })
                                            break;
                                        case 203:
                                            setoutput("Les informations que vous nous avez fournies ne sont pas correctes !")
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Erreur',
                                                text2: 'Les informations que vous nous avez fournies ne sont pas correctes !',
                                            });
                                            break;
                                        case 400:
                                            setoutput("Les informations que vous nous avez fournies ne sont pas correctes !")
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Erreur',
                                                text2: 'Les informations que vous nous avez fournies ne sont pas correctes !',
                                            });
                                            break;
                                        default:
                                            setoutput("Une erreur serveur vient de se produire")
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Erreur',
                                                text2: 'Une erreur serveur vient de se produire',
                                            });
                                            break;
                                    }
                                }else{
                                    setisloading(false)
                                    setoutput("Une erreur serveur vient de se produire")
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Une erreur serveur vient de se produire',
                                    });
                                }
                            })
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Password is required',
                                text2: 'An unknown error has just occurred!',
                            });
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Password is required',
                            text2: 'Enter your password before proceding !',
                        });
                    }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Champs obligatoire',
                        text2: 'Entrer une adresse mail ou un numéro de téléphone !',
                    });
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Pas d\'internet',
                    text2: 'Votre téléphone n\'est pas connecté sur internet',
                });
                setoutput("Votre téléphone n\'est pas connecté sur internet")
            }
        })
    };

    return(
        <>
            <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
                <Header colors={Colors.whiteColor} />
                <ScrollView 
                    endFillColor={Colors.primaryColor}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ paddingBottom: 0, backgroundColor: Colors.primaryColor }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: Dims.height, marginTop: Dims.smallradius }}>
                    <View style={{ width: "85%", alignSelf: "center", height: 50, alignContent: "center", alignItems: 'center', marginTop: Dims.bigradius }}>
                        <Text style={{ fontFamily: "mons", textAlign: "left", fontSize: Dims.titletextsize + 4, color: Colors.primaryColor }}>Réinitialisation de mot de passe</Text>
                        <TouchableHighlight
                            underlayColor={"transparent"}
                            onPress={() => {
                                // Linking.openURL("")
                            }}
                            style={{ marginBottom: 15 }}
                        >
                            <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Entrer votre adresse mail pour la recuperation de votre mot de passe</Text>
                        </TouchableHighlight>
                        <Divider />
                    </View>
                    <View style={{width: "85%", alignSelf: "center", marginTop: 20 }}>
                        <View style={{width: "100%", height: 65, flexDirection: "column"}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse mail ou numéro de téléphone</Text>
                            <View style={[ inputGroupForLoginOnly.container, { flexDirection: "row-reverse" } ]}>
                                <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                    <TextInput placeholder='eg: email | numéro de téléphone' maxLength={100} keyboardType={"email-address"} onChangeText={(t) => setnum(t)} style={[ inputGroupForLoginOnly.input, { fontFamily: "mons", width: "100%" }]} />
                                </View>
                                <View style={[ inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}>
                                    <AntDesign name="user" size={Dims.iconsize} color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* ------------------------ */}
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginVertical: 25 }}>
                            <TouchableHighlight 
                                onPress={() => {
                                    onSubmit()
                                }}
                                disabled={isloading}
                                underlayColor={ Colors.primaryColor }
                                style={btn}
                            >
                                {isloading 
                                ?
                                    <Loader/>
                                :
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Continuer</Text>    
                                }
                            </TouchableHighlight>
                            <Text style={{fontFamily: "mons", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "center" }}>
                                {output}
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", width: "85%", alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ width: "35%" }}>
                            <Divider style={dividerStyle} />
                        </View>
                        <View>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>OU</Text>
                        </View>
                        <View style={{ width: "35%" }}>
                            <Divider style={dividerStyle} />
                        </View>
                    </View>
                    <View style={{ width: "85%", alignSelf: "center" }}>
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                            <TouchableHighlight 
                                underlayColor={Colors.secondaryColor}
                                onPress={() => navigation.navigate("signup")}
                                style={[btn, { backgroundColor: Colors.secondaryColor }]}>
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>J'ai déjà un compte | Connexion</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                </ScrollView>
                <Footer/>
                <DialogBox ref={ref} isOverlayClickClose={false} />
            </View>
        </>
    )
}