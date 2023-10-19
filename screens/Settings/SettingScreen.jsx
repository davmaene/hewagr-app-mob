import * as React from 'react';
import { View, Text, Modal, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, Fontisto, FontAwesome, FontAwesome5, MaterialCommunityIcons, Zocial, Octicons } from '@expo/vector-icons';
import { inputGroup } from '../../assets/styles/Styles';
import { Loader } from '../../components/Loader/comp.loader';
import { Divider } from 'react-native-elements';
import { onRunExternalRQST } from '../../services/communications';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../assets/Toast/Toastconfig';
import * as Updates from 'expo-updates';
import DialogBox from 'react-native-dialogbox';

export const SettingScreen = ({ navigation }) => {
    
    const [ isshown, setishown ] = React.useState(false);
    const [ pwd1, setpwd1 ] = React.useState("");
    const [ pwd, setpwd ] = React.useState("");
    const [ pwd2, setpwd2 ] = React.useState("");
    const [ canshow, setcanshow ] = React.useState(false);
    const [ isLoading, setisloading ] = React.useState(false);
    const user = global && global['user'];
    const ref = React.useRef();

    React.useEffect(() => {
        setcanshow(false)
    }, [])

    return(
        <>
           <Title 
                navigation={navigation} 
                title={"Paramètres"} 
                subtitle={"Personalisation de l'appication"} 
            />
           <View style={{ paddingHorizontal: 10 }}>
                <View style={{ marginTop: 10 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Compte</Text>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" } }
                            underlayColor={"transparent"}
                            onPress={ () => setishown(!isshown) }
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                    <MaterialIcons name="edit" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Changer le mot de passe </Text>
                                </View>
                                <View>
                                    {/* <Text>&nbsp; </Text> */}
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" } }
                            underlayColor={"transparent"}
                            // onPress={ () => setishown(!isshown) }
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                    <MaterialIcons name="phone-android" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Changer le numéro de téléphone </Text>
                                </View>
                                <View>
                                    {/* <Text>&nbsp; </Text> */}
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
                {/* ------------------------------------------------ */}
           </View>
           <Modal
                visible={isshown}
                onDismiss={ _ => setishown(false) }
           >
                <Title navigation={navigation} title={"Paramètres"} subtitle={"Personalisation de l'appication"} action={() => setishown(false)} />
                <ScrollView 
                    style={{ paddingHorizontal: 20, marginTop: 20 }}
                    contentContainerStyle={{ paddingBottom: "100%" }}
                >
                    <View style={{width: "100%", display: canshow ? "none" : "flex", height: 65, flexDirection: "column", marginTop: 0}}>
                        <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Mot de passe actuel <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                        <View style={ inputGroup.container }>
                            <View style={ inputGroup.inputcontainer }>
                                <TextInput
                                    // value={pwd1}
                                    onChangeText={t => setpwd(t)} 
                                    secureTextEntry={true}
                                    editabl={!canshow}
                                    placeholder='Mot de passe actuel' 
                                    style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                />
                            </View>
                            <View style={[ inputGroup.iconcontainer, {  }]}>
                                <FontAwesome name="lock" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                            </View>
                        </View>
                    </View>
                    <View style={{ width: "100%", alignSelf: "center", marginTop: 20 }}>
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 2 }}>
                            <TouchableHighlight 
                                disabled={canshow}
                                underlayColor={ Colors.primaryColor }
                                onPress={() => {
                                    if(pwd.length > 0){
                                        setisloading(true)
                                        onRunExternalRQST({
                                            method: "POST",
                                            url: `/ambassadeurs/ambassadeur/signin`,
                                            data: {
                                                email: user && user['phone'],
                                                password: pwd
                                            }
                                        }, (err, done) => {
                                            if(done){
                                                setisloading(false)
                                                switch (done['status']) {
                                                    case 200:
                                                        setcanshow(true)
                                                        break;

                                                    case 203:
                                                        Toast.show({
                                                            type: 'error',
                                                            text1: 'Erreur',
                                                            text2: 'Le mot de passe ou le nom d\'utilisateur incorect',
                                                        });
                                                        break;

                                                    default:
                                                        Toast.show({
                                                            type: 'error',
                                                            text1: 'Erreur',
                                                            text2: 'Une erreur inconue vient de se produire !',
                                                        });
                                                        break;
                                                }
                                            }else{
                                                setisloading(false)
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Erreur',
                                                    text2: `Une erreur vient de se produire !`,
                                                });
                                            }
                                        })
                                    }else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Case vide',
                                            text2: `Entrer votre ancien mot de passe !`,
                                        });
                                    }
                                }}
                                style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                            >
                                {isLoading ? <Loader /> : <Text style={{ color: Colors.pillColor, fontFamily: "mons-b" }}>Vérifier</Text>}
                            </TouchableHighlight>
                        </View>
                    </View>
                    <Divider />
                    {canshow && 
                        (
                            <View style={{ }}>
                                <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 40}}>
                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nouveau mot de passe <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                    <View style={ inputGroup.container }>
                                        <View style={ inputGroup.inputcontainer }>
                                            <TextInput
                                                secureTextEntry={true}
                                                value={pwd1}
                                                onChangeText={t => setpwd1(t)} 
                                                placeholder='Mot de passe' 
                                                style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                            />
                                        </View>
                                        <View style={[ inputGroup.iconcontainer, {  }]}>
                                            <FontAwesome name="lock" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                        </View>
                                    </View>
                                </View>
                                <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 20}}>
                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Répétition de mot de passe <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                    <View style={ inputGroup.container }>
                                        <View style={ inputGroup.inputcontainer }>
                                            <TextInput
                                                value={pwd2}
                                                secureTextEntry={true}
                                                onChangeText={t => setpwd2(t)} 
                                                placeholder='répétition Mot de passe' 
                                                style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                            />
                                        </View>
                                        <View style={[ inputGroup.iconcontainer, {  }]}>
                                            <FontAwesome name="lock" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: "100%", alignSelf: "center", marginTop: 20 }}>
                                    <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 2 }}>
                                        <TouchableHighlight 
                                            underlayColor={ Colors.primaryColor }
                                            onPress={() => {
                                                if(pwd1.length >= 6){
                                                    if(pwd1.toString() === pwd2.toString()){
                                                        setisloading(true)
                                                        onRunExternalRQST({
                                                            method: "PUT",
                                                            data: {
                                                                newpassword: pwd1,
                                                                idambassadeur: user && user['realid']
                                                            },
                                                            url: `/ambassadeurs/update/ambassadeur/password`
                                                        }, (er, d) => {
                                                            if(d && d['status'] === 200){
                                                                setisloading(false)
                                                                Toast.show({
                                                                    type: 'success',
                                                                    text1: 'Mis à jour réussie',
                                                                    text2: `la mis à jour a réussie avec succès !`,
                                                                });
                                                                
                                                                ref.current.tip({
                                                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Mis à jour compte</Text>,
                                                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Votre mot de passe vient d'être mis à jour avec succès !</Text>],
                                                                    btn: {
                                                                        text: 'Continuer',
                                                                        style: {
                                                                            color: Colors.primaryColor,
                                                                            fontFamily: 'mons'
                                                                        },
                                                                        callback: () => {
                                                                            setcanshow(false);
                                                                            setishown(false);
                                                                            Updates.reloadAsync()
                                                                        }
                                                                    }
                                                                })
                                                            }else{
                                                                setisloading(false)
                                                                Toast.show({
                                                                    type: 'error',
                                                                    text1: 'Erreur de mis à jour',
                                                                    text2: `Une erreur vient de se produire !`,
                                                                });
                                                            }
                                                        })
                                                    }else{
                                                        Toast.show({
                                                            type: 'error',
                                                            text1: 'Case oblgatoire',
                                                            text2: `Les mots de passes ne sont identiques !`,
                                                        });
                                                    }
                                                }else{
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Case oblgatoire',
                                                        text2: `Le mot de passe doit avoir aumoins 6 caractères !`,
                                                    });
                                                }
                                            }}
                                            style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                        >
                                            {isLoading ? <Loader /> : <Text style={{ color: Colors.pillColor, fontFamily: "mons-b" }}>Changer le mot de passe</Text>}
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                </ScrollView>
                <Footer />
                <Toast config={toastConfig} />
                <DialogBox ref={ref} isOverlayClickClose={false} />
           </Modal>
           <Footer />
           <DialogBox ref={ref} isOverlayClickClose={false} />
           <Toast config={toastConfig} />
        </>
    )
}