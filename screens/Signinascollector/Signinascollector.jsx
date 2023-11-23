import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard, TouchableHighlightBase, SafeAreaView } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, Ionicons, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { btn, buttons, inputGroupForLoginOnly, inputGroupForLoginOnlyForLoginOnly, modal } from '../../assets/styles/Styles';
import { Divider } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { localStorageSAVE, onRunExternalRQST, onRunExternalRQSTE, onRunInsertQRY } from '../../services/communications';
import DialogBox from 'react-native-dialogbox';
import { Loader } from '../../components/Loader/comp.loader';
import Tooltip from 'react-native-walkthrough-tooltip';
import NetInfos from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import { keys, sessionExpires } from '../../assets/Helper/Helpers';

export const SigninAsCollectorScreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [num, setnum] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [eye, seteye] = React.useState(true);
    const [output, setoutput] = React.useState("");
    const [toolt, settoolt] = React.useState("");
    const [toolte, settoolte] = React.useState("");
    const [isVisible, setisVisible] = React.useState(false);
    const ref = React.useRef();
    const [showupchoice, setshowupchoice] = React.useState(false);

    const BottomSheetDialog = ({ navigation, visible, title: { text, color }, subTitle: { sText, sColor } }) => {
        return (
            <Modal
                isVisible={isVisible}
                animationIn={"slideInUp"}
                animationOut={"slideInDown"}
                onBackButtonPress={() => { setisVisible(!isVisible) }}
                onBackdropPress={() => { setisVisible(!isVisible) }}
                style={modal}
            >
                <SafeAreaView style={[buttons, { paddingVertical: 15, height: "auto" }]}>
                    <View style={{ width: "90%", flexDirection: "column", justifyContent: "space-between", alignSelf: "center", minHeight: 100 }}>
                        <View style={{ alignContent: "center", alignItems: "center", alignSelf: "center", marginTop: 20, marginBottom: 10 }}>
                            <MaterialIcons name='wifi-off' color={Colors.dangerColor} size={50} />
                        </View>
                        <>
                            <View style={{ height: 55, marginBottom: 20 }}>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, paddingTop: 5, textAlign: "center", color: color ? color : Colors.darkColor }}>{text}</Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, textAlign: "center", color: sColor ? sColor : Colors.darkColor, paddingTop: 10 }}>{sText}</Text>
                            </View>
                        </>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }

    const onSubmit = async () => {
        setoutput("");
        if (num.length > 0) {
            if (password.length > 0) {
                NetInfos.fetch().then(on => {
                    if (on.isConnected) {
                        setisVisible(false)
                        try {
                            setisloading(true)
                            onRunExternalRQST({
                                method: "POST",
                                url: "/collectors/collector/signin",
                                data: {
                                    "username": num,
                                    "password": password,
                                    "parms": Math.floor(Math.random() * 10 * 10 * 1000)
                                }
                            }, (err, done) => {
                                if (done) {
                                    setisloading(false)
                                    switch (done['status']) {
                                        case 200:
                                            const u = done && done['data'];
                                            const { roles, idlangue, isactivated, token } = u;
                                            onRunInsertQRY({
                                                table: "__tbl_user",
                                                columns: `'realid', 'nom', 'postnom', 'prenom', 'datenaissance', 'email', 'phone', 'adresse', 'genre', 'idvillage', 'crearedon', 'iscollector'`,
                                                dot: "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?",
                                                values: [`${u['id']}`, `${u['nom']}`, `${u['postnom']}`, `${u['prenom']}`, `${u['datenaissance']}`, `${u['email']}`, `${u['phone']}`, `${u['adresse']}`, `${u['genre']}`, `${u['idvillage']}`, `${new Date().toLocaleString()}`, 1]
                                            }, (err, insert) => {
                                                if (insert) {
                                                    localStorageSAVE({
                                                        data: done,
                                                        expires: null, // sessionExpires
                                                        key: keys['loginState']
                                                    }, (er, ok) => {
                                                        if (ok) {
                                                            localStorageSAVE({
                                                                data: `Bearer ${token}`,
                                                                expires: null, // sessionExpires
                                                                key: keys['token']
                                                            }, (er_, dn) => {
                                                                if (dn) {
                                                                    global.user = insert;
                                                                    global.token = token;
                                                                    global.iscollecteur = 0;
                                                                    navigation.replace("tabs");
                                                                } else {
                                                                    Toast.show({
                                                                        type: 'error',
                                                                        text1: 'Erreur',
                                                                        text2: 'Une erreur est survenue lors de la vérification du compte !',
                                                                    });
                                                                }
                                                            })
                                                        } else {
                                                            Toast.show({
                                                                type: 'error',
                                                                text1: 'Erreur',
                                                                text2: 'Une erreur est survenue lors de la vérification du compte !',
                                                            });
                                                        }
                                                    })
                                                    // console.log("Inserted data is => ", insert);
                                                } else {
                                                    setisloading(false);
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
                                } else {
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
                    } else {
                        setisVisible(true)
                        Toast.show({
                            type: 'error',
                            text1: 'Connectivité',
                            text2: 'Le téléphone n\'est pas connecté sur internet'
                        });

                    }
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Entrer le mot de passe',
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Entrer un nom d\'utilsateur valide',
            });
        }
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
                <Header colors={Colors.whiteColor} />
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 0, backgroundColor: Colors.primaryColor }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: Dims.height, marginTop: Dims.smallradius }}>
                        <>
                            <View style={{ width: "85%", alignSelf: "center", height: 50, alignContent: "center", alignItems: 'center', marginTop: Dims.bigradius }}>
                                <Text style={{ fontFamily: "mons", textAlign: "left", fontSize: Dims.titletextsize + 4, color: Colors.primaryColor }}>Compte collecteur.</Text>
                                <TouchableHighlight
                                    underlayColor={"transparent"}
                                    onPress={() => {
                                        // Linking.openURL("")
                                    }}
                                >
                                    <Text style={{ fontFamily: "mons-e" }}>Connectez-vous avec vos identifiants <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>collecteur</Text></Text>
                                </TouchableHighlight>
                                <Divider />
                            </View>
                            <View style={{ width: "85%", alignSelf: "center", marginTop: "5%" }}>
                                <View style={{ width: "100%", height: 65, flexDirection: "column" }}>
                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nom d'utilsateur | numéro de téléphone</Text>
                                    <View style={[inputGroupForLoginOnly.container, { flexDirection: "row-reverse" }]}>
                                        <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                            <TextInput
                                                placeholder='ex: email@domain.ext'
                                                maxLength={50}
                                                keyboardType={"email-address"}
                                                onChangeText={(t) => setnum(t)}
                                                style={[inputGroupForLoginOnly.input, { fontFamily: "mons", width: "100%", paddingRight: 20 }]} />
                                        </View>
                                        <View style={[inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}>
                                            <Tooltip
                                                isVisible={toolte}
                                                content={<Text style={{ fontFamily: "mons-e" }}>Entrez votre nom d'utilisateur</Text>}
                                                placement="top"
                                                onClose={() => settoolte(false)}
                                            >
                                                <FontAwesome5
                                                    onPress={() => settoolte(true)}
                                                    name="user-alt"
                                                    size={Dims.iconsize - 5}
                                                    color={Colors.primaryColor}
                                                />
                                            </Tooltip>
                                        </View>
                                    </View>
                                </View>
                                {/* ------------------------ */}
                                <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                    <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Mot de passe</Text>
                                    <View style={[inputGroupForLoginOnly.container, { flexDirection: "row-reverse" }]}>
                                        <TouchableHighlight
                                            underlayColor={Colors.whiteColor}
                                            onPress={() => seteye(!eye)}
                                            style={[inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}
                                        >
                                            <Ionicons name={eye ? "eye-off" : "eye"} size={Dims.iconsize} color={Colors.primaryColor} />
                                        </TouchableHighlight>
                                        <View style={[inputGroupForLoginOnly.inputcontainer, { width: "60%" }]}>
                                            <TextInput placeholder='******' secureTextEntry={eye} enablesReturnKeyAutomatically onChangeText={(t) => setpassword(t)} style={[inputGroupForLoginOnly.input, { fontFamily: "mons" }]} />
                                        </View>
                                        <View style={[inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}>
                                            <Tooltip
                                                isVisible={toolt}
                                                content={<Text style={{ fontFamily: "mons-e" }}>Entrez votre mot de passe de connexion dans ce champs</Text>}
                                                placement="top"
                                                onClose={() => settoolt(false)}
                                            >
                                                <Entypo
                                                    onPress={() => settoolt(true)}
                                                    name="lock"
                                                    size={Dims.iconsize - 3}
                                                    color={Colors.primaryColor}
                                                />
                                            </Tooltip>
                                        </View>
                                    </View>
                                </View>

                                {/* ------------------------ */}
                                <View style={{ paddingTop: 10, alignSelf: "flex-end" }}>
                                    <TouchableHighlight
                                        underlayColor={Colors.whiteColor}
                                        onPress={() => navigation.navigate("recoverpassword")}
                                        style={{ width: "100%", borderRadius: Dims.borderradius, paddingVertical: 6, justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}
                                    >
                                        <>
                                            <Feather name="arrow-right" size={Dims.iconsize - 2} color={Colors.primaryColor} />
                                            <Text style={{ color: Colors.primaryColor, fontFamily: "mons-b", marginLeft: 10 }}>Mot de passe oublié ?</Text>
                                        </>
                                    </TouchableHighlight>
                                </View>
                                {/* ------------------------ */}
                                <View style={{ width: "100%", height: 65, flexDirection: "column", marginVertical: 25, marginTop: 10 }}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            onSubmit()
                                        }}
                                        disabled={isloading}
                                        underlayColor={Colors.primaryColor}
                                        style={btn}
                                    >
                                        {isloading
                                            ?
                                            <Loader />
                                            :
                                            <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Connexion</Text>
                                        }
                                    </TouchableHighlight>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "center" }}>
                                        {output}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", width: "85%", alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ width: "40%" }}>
                                    <Divider />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>OU</Text>
                                </View>
                                <View style={{ width: "40%" }}>
                                    <Divider />
                                </View>
                            </View>
                            <View style={{ width: "85%", alignSelf: "center", marginTop: 20 }}>
                                <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 2 }}>
                                    <TouchableHighlight
                                        underlayColor={Colors.pillColor}
                                        onPress={() => navigation.navigate("signin")}
                                        style={{ width: "100%", backgroundColor: Colors.pillColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                    >
                                        <Text style={{ color: Colors.primaryColor, fontFamily: "mons-b" }}>Connexion en tant que ambassadeur</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </>
                    </View>
                </ScrollView>
                <Footer />
                <DialogBox ref={ref} isOverlayClickClose={false} />
                <BottomSheetDialog
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
                            sText: "Il semble que vous n'êtes pas connectez sur internet, connectez votre téléphone sur internet puis réessayez"
                        }
                    }
                />
            </View>
        </>
    )
}