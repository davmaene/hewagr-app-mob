import * as React from 'react';
import { StatusBar, View, Text, Animated, TouchableHighlight, TextInput, SafeAreaView, Image } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { appname, appslogan } from '../../assets/configs/configs';
import { onRunExternalRQST, onRunExternalRQSTE } from '../../services/communications';
import { Loader } from '../../components/Loader/comp.loader';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native';
// import { Image } from 'react-native-elements';
import Modal from 'react-native-modal';
import { RefreshControl } from 'react-native';
import { buttons, card, modal, shadow } from '../../assets/styles/Styles';
import NetInfos from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../assets/Toast/Toastconfig';
import { SpeedDialCustomer } from '../../components/SpeedDial/SpeedDialCustomer';
import GLOBAL from '../../components/GlobalHookAndState/GlobalHookAndState';

export const HomeScreen = ({ navigation }) => {

    const [isloading, setisloading] = React.useState(false);
    const [culvs, setculvs] = React.useState({});
    const [sousc, setsousc] = React.useState({});
    const [packs, setpacks] = React.useState(0);
    const [champs, setchamps] = React.useState({});
    const [isVisible, setisVisible] = React.useState(false);
    const user = global && global['user'];
    const [output, setoutput] = React.useState("");
    const [collections, setcollections] = React.useState([]);
    const [init, setInit] = React.useState(global && global.iscollecteur === 1 ? 1 : 0);

    const loadCultivateurs = async () => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/agriculteurs/liste/${parseInt(user && user['realid'])}`
        }, (er, done) => {
            // console.log(done);
            if (done && done['status'] === 200) {
                setisloading(false)
                setculvs(done && done['data']);
            } else {
                setisloading(false)
            }
        })
    };

    const loadSouscriptions = async () => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/souscriptions/liste/${user && user['realid']}`
        }, (er, done) => {
            if (done && done['status'] === 200) {
                setisloading(false)
                setsousc(done && done['data']);
            } else {
                setisloading(false)
            }
        })
    };

    const loadPaquets = async () => {
        setisloading(true)
        onRunExternalRQST({
            method: "GET",
            url: `/paiements/paiement/get/package/ambassador/${user && user['realid']}`
        }, (e, done) => {
            if (done && done['status'] === 200) {
                setisloading(false);
                setpacks(done && done['data'] && done['data']['package'] ? done['data']['package'] : 0);
            } else {
                setpacks(0);
                setisloading(false);
            }
        })
    };

    const loadChamps = async () => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/champs/liste/${parseInt(user && user['realid'])}`
        }, (er, done) => {
            if (done && done['status'] === 200) {
                setisloading(false)
                setchamps(done && done['data']);
            } else {
                setisloading(false)
            }
        })
    };

    const onLoadCollections = async () => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/infos-marches/collecte-user/${parseInt(user && user['realid'])}?status=0`
        }, (er, done) => {
            console.log(done, er);
            if (done && done['status'] === 200) {
                setisloading(false)
                setcollections(done && done['data']);
            } else {
                setisloading(false)
                setcollections([])
            }
        })
    };

    const onLoadAbonnement = async () => {
        // setisloading(true)
        setsousc([])
        // await onRunExternalRQST({
        //     method: "GET",
        //     url: `/souscriptions/liste/${user && user['realid']}`
        // }, (er, done) => {
        //     if(done && done['status'] === 200){
        //         setisloading(false)
        //         setsousc(done && done['data']);
        //     }else{
        //         setisloading(false)
        //     }
        // })
    };

    // ================= loadng info according to ambassador =====
    const __ = async () => {
        NetInfos.fetch().then(state => {
            if (state.isConnected) {
                setisVisible(false);
                loadChamps();
                loadSouscriptions();
                loadCultivateurs();
                loadPaquets();
            } else {
                setisVisible(true);
                Toast.show({
                    type: 'error',
                    text1: 'Erreur de connexion',
                    text2: `Il semble que ce téléphone n'est pas connecté sur internet !`,
                });
            }
        })
    };

    // ================ loading information acconding to collector ====
    const ___ = async () => {
        alert(1)
        onLoadCollections()
        onLoadAbonnement()
    };

    const BottomSheetDialog = ({ navigation, visible, title: { text, color }, subTitle: { sText, sColor } }) => {
        return (
            <Modal
                isVisible={visible}
                animationIn={"slideInUp"}
                animationOut={"slideInDown"}
                onBackButtonPress={() => { setisVisible(!visible) }}
                onBackdropPress={() => { setisVisible(!visible) }}
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
                <Toast config={toastConfig} />
            </Modal>
        )
    };

    // ======================== AS Ambassador case ===========
    const AsAmbassadeurCase = () => {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        onRefresh={__}
                        refreshing={isloading}
                        colors={[Colors.primaryColor]}
                    />
                }
                contentContainerStyle={{ paddingBottom: "100%" }}
                style={{}}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}>
                    <Divider />
                </View>
                <>
                    <View style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}>
                        <Text style={[shadow, { paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize, color: Colors.whiteColor }]}>Activités</Text>
                        <Text style={[shadow, { fontFamily: "mons", fontSize: Dims.subtitletextsize, color: Colors.whiteColor }]}>Séction l'évolutions des vos activités </Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        {/* ----------------------------------------- */}
                        <View style={{ flexDirection: "row", paddingHorizontal: 10, alignContent: "center", alignItems: "center", justifyContent: "space-around" }}>

                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                onPress={() => navigation.navigate("listeagr", { liste: culvs })}
                                style={[card, { backgroundColor: Colors.whiteColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.primaryColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.whiteColor, fontSize: 9 }, shadow]} allowFontScaling={false}>Nbr.&nbsp; d'agriculteurs</Text>
                                    {isloading
                                        ?
                                        (
                                            <Loader size={10} color={Colors.whiteColor} />
                                        )
                                        :
                                        (
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.whiteColor }}>
                                                {culvs && culvs.hasOwnProperty("length") ? culvs['length'] : "---"}
                                            </Text>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                onPress={() => {
                                    navigation.navigate("listesousc", { liste: sousc })
                                }
                                }
                                style={[card, { backgroundColor: Colors.whiteColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.primaryColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.whiteColor, fontSize: 9 }, shadow]} allowFontScaling={false} >Nbr.&nbsp; d'abonnements</Text>
                                    {isloading
                                        ?
                                        (
                                            <Loader size={10} color={Colors.whiteColor} />
                                        )
                                        :
                                        (
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.whiteColor }}>
                                                {sousc && sousc.hasOwnProperty("length") ? sousc['length'] : "---"}
                                            </Text>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>
                        </View>
                        {/* ----------------------------------------- */}
                        <View style={{ flexDirection: "row", paddingHorizontal: 10, alignContent: "center", alignItems: "center", justifyContent: "space-around", marginTop: 15 }}>

                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                onPress={() => navigation.navigate("listechamps", { liste: champs })}
                                style={[card, { backgroundColor: Colors.whiteColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.primaryColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.whiteColor, fontSize: 9 }, shadow]} allowFontScaling={false}>Nbr.&nbsp; de champs</Text>
                                    {isloading
                                        ?
                                        (
                                            <Loader size={10} color={Colors.whiteColor} />
                                        )
                                        :
                                        (
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.whiteColor }}>
                                                {champs && champs.hasOwnProperty("length") ? champs['length'] : "---"}
                                            </Text>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}

                                style={[card, { backgroundColor: Colors.primaryColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.whiteColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.primaryColor, fontSize: 9 }, shadow]} allowFontScaling={false} >Mes paquets</Text>
                                    {isloading
                                        ?
                                        (
                                            <Loader size={10} color={Colors.primaryColor} />
                                        )
                                        :
                                        (
                                            <View>
                                                <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.primaryColor }}>
                                                    {packs}
                                                    {packs > 0 &&
                                                        (
                                                            <Text style={{ fontSize: Dims.subtitletextsize - 2, fontFamily: "mons-b" }}>
                                                                &nbsp; ( {packs * 30} SMS )
                                                            </Text>
                                                        )
                                                    }
                                                </Text>
                                            </View>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </>
                <View style={{ width: "90%", alignSelf: "center", marginBottom: 10, marginTop: 20 }}>
                    <Divider />
                </View>
                <>
                    <View style={{ width: "90%", alignSelf: "center", paddingLeft: 0 }}>
                        <Text style={[shadow, { paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize, color: Colors.whiteColor }]}>Accès direct</Text>
                        <Text style={[shadow, { fontFamily: "mons", fontSize: Dims.subtitletextsize, color: Colors.whiteColor }]}>Boutons et accès directe aux fonctionnalités </Text>
                    </View>
                    <View style={{ width: "100%", padding: 10, paddingHorizontal: 15 }}>

                        <TouchableHighlight
                            underlayColor={Colors.primaryColor}
                            onPress={() => navigation.navigate("abonnement")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.primaryColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <View style={{ backgroundColor: Colors.primaryColor, padding: 2 }}>
                                    <MaterialIcons name="add" size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-e", color: Colors.whiteColor, fontSize: Dims.subtitletextsize }}>Abonnement | <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>prix du marché</Text></Text>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor={Colors.primaryColor}
                            onPress={() => navigation.navigate("souscription")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.primaryColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <View style={{ backgroundColor: Colors.primaryColor, padding: 2 }}>
                                    <MaterialIcons name="add" size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-e", color: Colors.whiteColor, fontSize: Dims.subtitletextsize }}>Abonnement |  <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Météo</Text></Text>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor={Colors.primaryColor}
                            onPress={() => navigation.navigate("conseil")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.primaryColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <View style={{ backgroundColor: Colors.primaryColor, padding: 2 }}>
                                    <MaterialIcons name="add" size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-e", color: Colors.whiteColor, fontSize: Dims.subtitletextsize }}>Abonnement |  <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Conseils agricoles</Text></Text>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            onPress={() => navigation.navigate("addcultivateur")}
                            style={{
                                width: "100%",
                                height: 55,
                                marginTop: 10,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.whiteColor,
                                paddingHorizontal: 20,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <AntDesign name="adduser" size={Dims.iconsize} color={Colors.primaryColor} />
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b", color: Colors.primaryColor, fontSize: Dims.subtitletextsize }}>Ajouter un agriculteur</Text>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            onPress={() => navigation.navigate("addchamps")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.whiteColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <MaterialIcons name="leak-add" size={Dims.iconsize} color={Colors.primaryColor} />
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b", color: Colors.primaryColor, fontSize: Dims.subtitletextsize }}>Ajouter un champs</Text>
                            </>
                        </TouchableHighlight>

                        {/* <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            onPress={() => navigation.navigate("addzone")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.whiteColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <MaterialIcons name="add-box" size={ Dims.iconsize } color={Colors.primaryColor} />
                                <Text style={{ paddingLeft: 10, fontFamily: "mons", color: Colors.darkColor }}>Ajout d'une zône de production</Text>
                            </>
                        </TouchableHighlight> */}

                    </View>
                </>
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
                            sText: output.length > 0 ? output : "Il semble que vous n'êtes pas connectez sur internet, vos informations peuvent être enregistrées en local; vous pouvew faire la synchronisation plus tard"
                        }
                    }
                />
            </ScrollView>
        )
    }

    // ======================== AS collector case ===========
    const AsCollectorCase = () => {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        onRefresh={() => {
                            ___()
                        }}
                        refreshing={isloading}
                        colors={[Colors.primaryColor]}
                    />
                }
                contentContainerStyle={{ paddingBottom: "100%" }}
                style={{}}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}>
                    <Divider />
                </View>
                <>
                    <View style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}>
                        <Text style={[shadow, { paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize, color: Colors.whiteColor }]}>Activités</Text>
                        <Text style={[shadow, { fontFamily: "mons", fontSize: Dims.subtitletextsize, color: Colors.whiteColor }]}>Séction l'évolutions des vos activités </Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        {/* ----------------------------------------- */}
                        <View style={{ flexDirection: "row", paddingHorizontal: 10, alignContent: "center", alignItems: "center", justifyContent: "space-around" }}>

                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                onPress={() => {
                                    navigation.navigate("listecollections", { liste: collections })
                                }}
                                style={[card, { backgroundColor: Colors.whiteColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.primaryColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.whiteColor, fontSize: 9 }, shadow]} allowFontScaling={false}>Nbr.&nbsp; des collections</Text>
                                    {isloading
                                        ?
                                        (
                                            <Loader size={10} color={Colors.whiteColor} />
                                        )
                                        :
                                        (
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.whiteColor }}>
                                                {collections && collections.hasOwnProperty("length") ? collections['length'] : "---"}
                                            </Text>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                onPress={() => {
                                    // navigation.navigate("listesousc", { liste: sousc }) 
                                }
                                }
                                style={[card, { backgroundColor: Colors.whiteColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.primaryColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.whiteColor, fontSize: 9 }, shadow]} allowFontScaling={false} >Nbr.&nbsp; d'abonnements</Text>
                                    {isloading
                                        ?
                                        (
                                            <Loader size={10} color={Colors.whiteColor} />
                                        )
                                        :
                                        (
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.whiteColor }}>
                                                {sousc && sousc.hasOwnProperty("length") ? sousc['length'] : "---"}
                                            </Text>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>
                        </View>
                        {/* ----------------------------------------- */}
                        {/* <View style={{ flexDirection: "row", paddingHorizontal: 10, alignContent: "center", alignItems: "center", justifyContent: "space-around", marginTop: 15 }}>

                            <TouchableHighlight 
                                underlayColor={ Colors.primaryColor }
                                onPress={() => navigation.navigate("listechamps", { liste: champs })}
                                style={[card, { backgroundColor: Colors.whiteColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.primaryColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.whiteColor, fontSize: 9 }, shadow]} allowFontScaling={false}>Nbr.&nbsp; de champs</Text>
                                    {isloading 
                                    ? 
                                        (
                                            <Loader size={10} color={Colors.whiteColor} />
                                        )
                                    :  
                                        (
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.whiteColor }}>
                                                {champs && champs.hasOwnProperty("length") ? champs['length'] : "---"}
                                            </Text>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor={ Colors.primaryColor }

                                style={[card, { backgroundColor: Colors.primaryColor }]}
                            >
                                <View style={{ width: "100%", height: "100%", backgroundColor: Colors.whiteColor, padding: Dims.paddingCard }}>
                                    <Text style={[{ fontFamily: "mons-b", color: Colors.primaryColor, fontSize: 9 }, shadow]} allowFontScaling={false} >Mes paquets</Text>
                                    {isloading 
                                    ? 
                                        (
                                            <Loader size={10} color={Colors.primaryColor} />
                                        )
                                    : 
                                        (
                                            <View>
                                                <Text style={{ fontFamily: "mons", fontSize: Dims.fontSizeCard - 4, color: Colors.primaryColor }}>
                                                    {packs}
                                                    {packs > 0 && 
                                                        (
                                                            <Text style={{ fontSize: Dims.subtitletextsize - 2 }}>
                                                            &nbsp; ( {packs * 30} SMS )
                                                            </Text>
                                                        )
                                                    }
                                                </Text>
                                            </View>
                                        )
                                    }
                                </View>
                            </TouchableHighlight>
                        </View> */}
                    </View>
                </>
                <View style={{ width: "90%", alignSelf: "center", marginBottom: 10, marginTop: 20 }}>
                    <Divider />
                </View>
                <>
                    <View style={{ width: "90%", alignSelf: "center", paddingLeft: 0 }}>
                        <Text style={[shadow, { paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize, color: Colors.whiteColor }]}>Accès direct</Text>
                        <Text style={[shadow, { fontFamily: "mons", fontSize: Dims.subtitletextsize, color: Colors.whiteColor }]}>Boutons et accès directe aux fonctionnalités </Text>
                    </View>
                    <View style={{ width: "100%", padding: 10, paddingHorizontal: 15 }}>

                        {/* <TouchableHighlight
                            underlayColor={Colors.primaryColor}
                            onPress={() => navigation.navigate("abonnement")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.primaryColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <View style={{ backgroundColor: Colors.primaryColor, padding: 2 }}>
                                    <MaterialIcons name="add" size={ Dims.iconsize } color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b", color: Colors.whiteColor }}>Nouvel abonnement</Text>
                            </>
                        </TouchableHighlight> */}

                        <TouchableHighlight
                            underlayColor={Colors.primaryColor}
                            onPress={() => navigation.navigate("collect")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.primaryColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <View style={{ backgroundColor: Colors.primaryColor, padding: 2 }}>
                                    <MaterialIcons name="add" size={Dims.iconsize} color={Colors.whiteColor} />
                                </View>
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b", color: Colors.whiteColor }}>Nouvelle collecte</Text>
                            </>
                        </TouchableHighlight>

                        {/* <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            onPress={() => navigation.navigate("addcultivateur")}
                            style={{
                                width: "100%",
                                height: 55,
                                marginTop: 10,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.whiteColor,
                                paddingHorizontal: 20,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <AntDesign name="adduser" size={ Dims.iconsize } color={Colors.primaryColor} />
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b", color: Colors.darkColor }}>Ajouter un nouvel agriculteur</Text>
                            </>
                        </TouchableHighlight>

                        <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            onPress={() => navigation.navigate("addchamps")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.whiteColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <MaterialIcons name="leak-add" size={ Dims.iconsize } color={Colors.primaryColor} />
                                <Text style={{ paddingLeft: 10, fontFamily: "mons-b", color: Colors.darkColor }}>Ajouter un nouveau champs</Text>
                            </>
                        </TouchableHighlight> */}

                        {/* <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            onPress={() => navigation.navigate("addzone")}
                            style={{
                                width: "100%",
                                height: 55,
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.whiteColor,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                borderRadius: Dims.borderradius
                            }}
                        >
                            <>
                                <MaterialIcons name="add-box" size={ Dims.iconsize } color={Colors.primaryColor} />
                                <Text style={{ paddingLeft: 10, fontFamily: "mons", color: Colors.darkColor }}>Ajout d'une zône de production</Text>
                            </>
                        </TouchableHighlight> */}

                    </View>
                </>
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
                            sText: output.length > 0 ? output : "Il semble que vous n'êtes pas connectez sur internet, vos informations peuvent être enregistrées en local; vous pouvew faire la synchronisation plus tard"
                        }
                    }
                />
            </ScrollView>
        )
    }

    React.useEffect(() => {

        GLOBAL.ScreenGlobal.setState({
            navigation: navigation
        });

        NetInfos.addEventListener(on => {
            if (on.isConnected) {
                if (init === 0) __()
                else ___();
            } else setisVisible(true)
        });

    }, [GLOBAL]);

    return (
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <LinearGradient
                    colors={[Colors.primaryColor, Colors.whiteColor]}
                    style={{ height: "90%", width: "100%" }}
                />
                <View
                    style={{ position: "absolute", width: "100%", height: Dims.height }}
                >
                    <View>
                        <View style={{ width: "100%", alignSelf: "center", padding: 20, flexDirection: "row", alignItems: "center", top: -20, justifyContent: "center" }}>
                            <View>
                                <Image
                                    source={require("../../assets/images/HewAgri_Icon-5.png")}
                                    style={{ width: 70, height: 70, resizeMode: "cover" }}
                                // PlaceholderContent={ <Loader color={Colors.whiteColor} size={12} /> } 
                                />
                            </View>
                            <View style={{ paddingBottom: 1 }}>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, color: Colors.whiteColor }}>{appname}</Text>
                                <Text style={{ fontFamily: "mons-e", color: Colors.whiteColor }}>{appslogan}</Text>
                            </View>
                        </View>
                        <View style={{ width: "100%", height: 40, alignContent: "center", alignItems: "center", paddingVertical: 10, marginBottom: 10, top: -50 }}>
                            <Text style={{ fontFamily: "mons", color: Colors.whiteColor }}>{init === 1 ? "Compte collecteur" : "Compte Ambassadeur"}</Text>
                            <View style={{ width: 50, borderRadius: Dims.borderradius, height: 8, backgroundColor: Colors.secondaryColor, alignSelf: "center", marginTop: 4 }} />
                        </View>
                    </View>
                    <View style={{ marginTop: -30 }}>
                        {init === 0 && (<AsAmbassadeurCase />)}
                        {init === 1 && (<AsCollectorCase />)}
                    </View>
                </View>
            </View>
            <SpeedDialCustomer />
        </>
    )
}