import * as React from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableHighlight, TextInput, Keyboard, ScrollView, Image } from 'react-native';
import { localStorageLOAD, localStorageSAVE, onDeconnextion, onRunExternalRQST, onRunExternalRQSTE, onRunRemoveQRY, onRunRetrieveQRY } from '../../services/communications';
import { Loader } from '../../components/Loader/comp.loader';
import { appname } from '../../assets/configs/configs';
import { Colors } from '../../assets/colors/Colors';
import Modal from 'react-native-modal';
import { btn, buttons, inputGroupForLoginOnly, inputGroupForLoginOnlyForLoginOnly, modal } from '../../assets/styles/Styles';
import { Dims } from '../../assets/dimensions/Dimemensions';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../assets/Toast/Toastconfig';
// import { Divider } from 'react-native-elements';
import { AntDesign, Entypo, Ionicons, Feather, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { keys, sessionExpires } from '../../assets/Helper/Helpers';
import Tooltip from 'react-native-walkthrough-tooltip';
import DialogBox from 'react-native-dialogbox';
import NetInfos from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';

const BottomSheetDialog = ({ visible, navigation, route }) => {

    const [isVisible, setisVisible] = React.useState(false);
    const [output, setoutput] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [toolt, settoolt] = React.useState(true);
    const [eye, seteye] = React.useState(true);
    const ref = React.useRef();
    const [isloading, setisloading] = React.useState(false);
    const [height, setheight] = React.useState(0);
    const [user, setuser] = React.useState(global && global.user);
    const { params } = route; 
    const { as } = params;
    
    const shownK = Keyboard.addListener("keyboardDidHide", (e) => {
        setheight(e.endCoordinates.height)
    });

    const hidenK = Keyboard.addListener("keyboardDidShow", (e) => {
        setheight(e.endCoordinates.height)
    });

    const logAsAmbassadeur = async () => {
        setoutput("")
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                if(password.length <= 0){
                    setoutput("Entrer le mot de passe avant de continuer")
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Entrer le mot de passe avant de continuer',
                    });

                    return false;
                } 
                setisloading(true)
                onRunExternalRQST({
                    method: "POST",
                    url: "/ambassadeurs/ambassadeur/signin",
                    data: {
                        email: user && user['email'],
                        password,
                    }
                }, (err, done) => {
                    if(done){
                        setisloading(false)
                        switch (done['status']) {
                            case 200:
                                localStorageSAVE({
                                    data: done['data'],
                                    expires: sessionExpires,
                                    key: keys['loginState']
                                }, (er, ok) => {
                                    if(ok){
                                        global.user = global.user;
                                        global.token = 'xaqxswcdevfr';
                                        global.iscollecteur = 0;
                                        navigation.replace("tabs");
                                    }else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur',
                                            text2: 'Une erreur est survenue lors de la vérification du compte !',
                                        });
                                    }
                                })
                                break;
                            case 203:
                                setoutput("Le mot de passe ou le nom d'utilisateur est incorect")
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur',
                                    text2: 'Le mot de passe ou le nom d\'utilisateur incorect',
                                });
                                break;
                            case 402:
                                setoutput("Votre compte n'est pas encore activé")
                                ref.current.confirm({
                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Activation compte</Text>,
                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Nous venons de détecter que Votre compte n'est pas encore activé, voulez-vous activer le compte</Text>],
                                    ok: {
                                        text: 'Activation du compte',
                                        style: {
                                            color: Colors.primaryColor,
                                            fontFamily: 'mons'
                                        },
                                        callback: () => navigation.replace("verifyaccount", { item: done['data'] })
                                    },
                                    cancel: {
                                        text: 'Annuler',
                                        style: {
                                            color: Colors.darkColor,
                                            fontFamily: "mons-e"
                                        }
                                    },
                                })
                                Toast.show({
                                    type: 'info',
                                    text1: 'Activation compte',
                                    text2: 'Votre compte n\'est pas encore activé',
                                });
                                break;
                            default:
                                setoutput("Une erreur inconue vient de se produire !")
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur',
                                    text2: 'Une erreur inconue vient de se produire !',
                                });
                                break;
                        }
                    }else{
                        console.log(err);
                        setisloading(false)
                        setoutput("Une erreur inconue vient de se produire !")
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Une erreur inconue vient de se produire !',
                        });
                    }
                })
            }else{
                setoutput("Pas de connexion internet ")
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Pas de connexion internet !',
                }); 
            }
        })
    };

    const logAsCollector = async () => {
        setoutput("")
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                if(password.length <= 0){
                    setoutput("Entrer le mot de passe avant de continuer")
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Entrer le mot de passe avant de continuer',
                    });

                    return false;
                } 
                setisVisible(false)
                try {
                    setisloading(true)
                    onRunExternalRQSTE({
                        method: "POST",
                        url: "/login",
                        data: {
                            "username": user && user['nom'],
                            "password": password,
                            "parms": Math.floor(Math.random() * 10 * 10 * 10)
                        }
                    }, (err, done) => {
                        if(done){
                            setisloading(false)
                            switch (done['status']) {
                                case 200:
                                    const u = done && done['data'];
                                    localStorageSAVE({
                                        data: u,
                                        expires: sessionExpires,
                                        key: keys['loginState']
                                    }, (er, ok) => {
                                        if(ok){
                                            global.user = global.user;
                                            global.token = done['token'];
                                            global.iscollecteur = 1;
                                            navigation.replace("tabs");
                                        }else{
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Erreur',
                                                text2: 'Une erreur est survenue lors de la vérification du compte !',
                                            });
                                        }
                                    })

                                    break;
                                case 201:
                                    setoutput("Le mot de passe ou le nom d'utilisateur est incorect")
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Le mot de passe ou le nom d\'utilisateur incorect',
                                    });
                                    break;
                                case 402:
                                    setoutput("Votre compte n'est pas encore activé")
                                    ref.current.confirm({
                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Activation compte</Text>,
                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Nous venons de détecter que Votre compte n'est pas encore activé, voulez-vous activer le compte</Text>],
                                        ok: {
                                            text: 'Activation du compte',
                                            style: {
                                                color: Colors.primaryColor,
                                                fontFamily: 'mons'
                                            },
                                            callback: () => navigation.replace("verifyaccount", { item: done['data'] })
                                        },
                                        cancel: {
                                            text: 'Annuler',
                                            style: {
                                                color: Colors.darkColor,
                                                fontFamily: "mons-e"
                                            }
                                        },
                                    })
                                    Toast.show({
                                        type: 'info',
                                        text1: 'Activation compte',
                                        text2: 'Votre compte n\'est pas encore activé',
                                    });
                                    break;
                                default:
                                    setoutput("Une erreur inconue vient de se produire !")
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Une erreur inconue vient de se produire !',
                                    });
                                    break;
                            }
                        }else{
                            setisloading(false)
                            setoutput("Une erreur inconue vient de se produire !")
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Une erreur inconue vient de se produire !',
                            });
                        }
                    })
                } catch (error) {
                    console.log("erreur => ", error);
                }
            }else{
                setisVisible(true)
                Toast.show({
                    type: 'error',
                    text1: 'Connectivité',
                    text2: 'Le téléphone n\'est pas connecté sur internet'
                });

            }
        })
    };

    const onLogin = async () => {

        NetInfos.fetch().then(on => {
            if(on.isConnected){
                switch (as) {
                    case 0:
                        logAsAmbassadeur()
                        break;
        
                    case 1:
                        logAsCollector()
                        break;
        
                    default:
                        logAsAmbassadeur()
                        break;
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Pas de connexion internet',
                    text2: 'Vérifier la connexion internet avant de continuer !',
                });
            }
        })
    };

    React.useEffect(() => {

    }, []);
    
    return(
        <View
            style={[{}, { display: visible ? "flex" : "none", backgroundColor: 'rgba(0,0,0,.7)', height: Dims.height, position: "absolute", width: Dims.width }]}
        >
            <View style={[buttons, { paddingVertical: 15, height: "auto", marginBottom: 0, bottom: height, position: "absolute", width: "100%" }]}>
                <View style={{ width: 50, borderRadius: Dims.borderradius, height: 8, backgroundColor: Colors.primaryColor, alignSelf: "center" }} />
                <View style={{ width: "90%", alignSelf: "center", paddingBottom: 100, backgroundColor: Colors.whiteColor, overflow: "visible" }}>
                    <View style={{ width: "100%", alignSelf: "center", height: "auto", overflow: "visible", alignContent: "center", alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontFamily: "mons", textAlign: "left", fontSize: Dims.bigtitletextsize, color: Colors.primaryColor }}> Session expirée</Text>
                        <Text style={{ fontFamily: "mons-e", textAlign: "center", paddingHorizontal: 20 }}>Connectez-vous avec vos identifiants pour restaurer votre <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>session | {as === 0 ? "Ambassadeur" : "Collecteur"}</Text></Text>
                        <View style={{ width: "100%", alignContent: "center", alignItems: "center", alignSelf:"center", paddingVertical: 10, marginTop: 0 }}>
                            <FontAwesome5 name="user-circle" size={40} color={Colors.primaryColor} />
                            <Text style={{ textTransform: "capitalize", color: Colors.primaryColor, fontFamily: "mons-b", fontSize: Dims.titletextsize }}>{`${user && user['nom']} ${user && user['postnom']}`}</Text>
                        </View>
                        <>
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 25}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Mot de passe <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={[ inputGroupForLoginOnly.container, { flexDirection: "row-reverse" }]}>
                                    <TouchableHighlight
                                        underlayColor={Colors.whiteColor}
                                        onPress={() => seteye(!eye)} 
                                        style={[ inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}
                                    >
                                        <Ionicons name={eye ? "eye-off" : "eye"} size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </TouchableHighlight>
                                    <View style={[ inputGroupForLoginOnly.inputcontainer, { width: "60%" } ]}>
                                        <TextInput placeholder='******' secureTextEntry={eye} enablesReturnKeyAutomatically onChangeText={(t) => setpassword(t)} style={[ inputGroupForLoginOnly.input, { fontFamily: "mons" } ]} />
                                    </View>
                                    <View style={[ inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}>
                                        <Tooltip
                                            isVisible={toolt}
                                            content={<Text style={{ fontFamily: "mons-e" }}>Entrez votre mot de passe de connexion dans ce champ</Text>}
                                            placement="top"
                                            onClose={() => settoolt(false)}
                                        >
                                            <Entypo 
                                                onPress={() => settoolt(true)}
                                                name="lock" 
                                                size={ Dims.iconsize - 3 } 
                                                color={ Colors.primaryColor } 
                                            />
                                        </Tooltip>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 10 }}>
                                <TouchableHighlight 
                                    onPress={() => {
                                        onLogin()
                                    }}
                                    disabled={isloading}
                                    underlayColor={ Colors.primaryColor }
                                    style={btn}
                                >
                                    {isloading 
                                    ?
                                        <Loader/>
                                    :
                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Connexion</Text>    
                                    }
                                </TouchableHighlight>
                            </View>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginVertical: 0, marginTop: 0 }}>
                                <TouchableHighlight 
                                    onPress={async () => {
                                        await onDeconnextion((err, done) => {
                                            if(done){
                                                Toast.show({
                                                    type: 'success',
                                                    text1: 'Déconnexion',
                                                    text2: 'Vos informations sont supprimées avec succès !',
                                                });

                                                RNRestart.Restart();

                                            }else{
                                                console.log("error => ", err);
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Déconnexion',
                                                    text2: 'Une erreur vient de se produire lors de la déconnexion !'
                                                });
                                            }
                                        })
                                    }}
                                    disabled={isloading}
                                    underlayColor={ Colors.whiteColor }
                                    style={[btn, { backgroundColor: Colors.whiteColor, marginVertical: 0, paddingVertical: 0 }]}
                                >
                                    {isloading 
                                    ?
                                        <Loader/>
                                    :
                                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: Colors.primaryColor, paddingHorizontal: 10, fontFamily: "mons" }}>Changer de compte</Text>  
                                            <MaterialIcons name='logout' size={Dims.iconsize} color={Colors.primaryColor} />
                                        </View>  
                                    }
                                </TouchableHighlight>
                                <Text style={{fontFamily: "mons-b", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "center" }}>
                                    {output}
                                </Text>
                            </View>
                        </>
                    </View>
                </View>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </View>
    )
};

export const LoadingAndCheckSessionSceen = ({ navigation, route }) => {

    const [isVisible, setisVisible] = React.useState(false);
    const [isVisiblec, setisVisiblec] = React.useState(false);
    const [output, setoutput] = React.useState("");
    const { params } = route; 
    const { as } = params;

    const BottomSheetDialogc = ({ navigation, visible, title: { text, color }, subTitle: { sText, sColor } }) => {
      return(
          <Modal
              isVisible={visible}
              animationIn={"slideInUp"}
              animationOut={"slideInDown"}
              onBackButtonPress={() => { setisVisiblec(!isVisiblec) }}
              onBackdropPress={() => { setisVisiblec(!isVisiblec) }}
              style={modal}
          >
              <SafeAreaView style={[buttons, { paddingVertical: 15, height: "auto" }]}>
                  <View style={{ width: "90%", flexDirection: "column", justifyContent: "space-between", alignSelf: "center", minHeight: 100 }}>
                      <View style={{ alignContent: "center", alignItems: "center", alignSelf: "center", marginTop: 20, marginBottom: 10 }}>
                          <MaterialIcons name='wifi-off' color={Colors.dangerColor} size={50} />
                      </View>
                      <>
                          <View style={{ height: 55, marginBottom: 20 }}>
                              <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, paddingTop: 5, textAlign: "center", color: color ? color : Colors.darkColor }}>{ text }</Text>
                              <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, textAlign: "center", color: sColor ? sColor : Colors.darkColor, paddingTop: 10 }}>{ sText }</Text>
                          </View>
                      </>
                  </View>
              </SafeAreaView>
              <Toast config={toastConfig} />
          </Modal>
        )
    };

    const loadSession = async () => {
        localStorageLOAD({
            key: keys['loginState']
        }, (err, done) => {
            if(done){
                global.user = global.user;
                global.token = as === 0 ? 'xaqxswcdevfr' : done['token'];
                global.iscollecteur = as;
                navigation.replace("tabs");
            }else{
                if(err === 1) navigation.replace("signinascollector");
                if(err === 2) setisVisible(true)
            }
        })
    };

    React.useEffect(() => {
        // setisVisible(true)
        loadSession();
    }, []);

    return(
        <View style={{flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar barStyle={"light-content"} backgroundColor={ Colors.primaryColor } />
            <>
                <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", marginTop: 100 }}>
                    {isVisible && <MaterialCommunityIcons name="emoticon-sad-outline" size={Dims.bigiconsize} color={Colors.primaryColor} />}
                    {!isVisible && (
                            <>
                                <Image 
                                    // PlaceholderContent={<Loader />} 
                                    source={require("../../assets/images/HewAgri_Icon-1.png")}
                                    style={{ resizeMode: "contain", width: 100, height: 100, marginBottom: 3 }}
                                />
                                <Loader size={32} color={Colors.primaryColor} />
                            </>
                        )
                    }
                    <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flexDirection: "column", paddingHorizontal: 30, marginTop: 40 }}>
                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize + 10, color: Colors.primaryColor }}>{isVisible ? "Session expirée" : "Chargement..."}</Text>
                    <Text style={{ textAlign: "center", fontFamily: "mons-e", color: Colors.primaryColor }}>Vérification de la session en cours; veuillez patientez un moment s'il vous plaît</Text>
                    </View>
                </View>
                <View style={{position: "absolute", bottom: "2%", width: "98%"}}>
                    <Text style={{ textAlign: "center", fontSize: 11 }}>&copy; {appname} | {appname} {new Date().getFullYear()} </Text>
                </View>
            </>

            <BottomSheetDialogc
                navigation={navigation} 
                visible={isVisiblec} 
                title={
                {
                    color: Colors.dangerColor, 
                    text: "Connectivité"
                }
                } 
                subTitle={
                { 
                    sColor: Colors.darkColor, 
                    sText: output.length > 0 ? output : "Il semble que vous n'êtes pas connectez sur internet, vos informations peuvent être enregistrées en local; vous pouvew faire la synchronisation plus tard" 
                }
                }
            />

            <BottomSheetDialog
                route={route}
                navigation={navigation} 
                visible={isVisible} 
                title={
                    {
                        color: Colors.dangerColor, 
                        text: "Connectivité"
                    }
                } 
                subTitle={
                    { 
                        sColor: Colors.darkColor, 
                        sText: output.length > 0 ? output : "Il semble que vous n'êtes pas connectez sur internet, vos informations peuvent être enregistrées en local; vous pouvew faire la synchronisation plus tard" 
                    }
                }
            />
        </View>
    )
}