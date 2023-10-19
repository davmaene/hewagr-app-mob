import * as React from 'react';
import { View, Text, TouchableHighlight, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { AntDesign, Entypo, Ionicons, Feather, FontAwesome5, MaterialIcons, Octicons } from '@expo/vector-icons';
import { btn, buttons, modal } from '../../assets/styles/Styles';
import { megaStorage, onRunExternalRQST, onRunRawQRY, onRunRetrieveQRY } from '../../services/communications';
import NetInfos from '@react-native-community/netinfo';
import DialogBox from 'react-native-dialogbox';
import Toast from 'react-native-toast-message';
import { appname } from '../../assets/configs/configs';
import { Footer } from '../../components/Footer/comp.footer';
import { Loader } from '../../components/Loader/comp.loader';
import { Title } from '../../components/Title/Title';
import Spinner from 'react-native-loading-spinner-overlay';
import { Divider } from 'react-native-elements';
import { toastConfig } from '../../assets/Toast/Toastconfig';

export const SynchronisationScreen = ({ navigation, route }) => {

    const [isVisible, setisVisible] = React.useState(false);
    const ref = React.useRef();
    const [isloading, setisloading] = React.useState(false);
    const [output, setoutput] = React.useState("");

    const [sAgri, setSAgri] = React.useState([])
    const [sVill, setSVil] = React.useState([])
    const [sTerr, setSTerr] = React.useState([])
    const [sProv, setSProv] = React.useState([])
    const [sCults, setSCults] = React.useState([])

    const [uAgri, setUAgri] = React.useState([]);
    const [uChamp, setUChamp] = React.useState([]);
    const [uVill, setUVil] = React.useState([]);
    const [uTerr, setUTerr] = React.useState([]);

    const [localysyncC, setlocalysyncC] = React.useState(false);
    const [localysyncA, setlocalysyncA] = React.useState(false);
    // const [uProv, setUProv] = React.useState([])

    const [canSynch, setcanSync] = React.useState(false);

    const BottomSheetDialog = ({ navigation, visible, title: { text, color }, subTitle: { sText, sColor } }) => {
        return(
            <Modal
                isVisible={visible}
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

    const onSynchFromMobileToServer = async () => {
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                if(1 && (( uChamp.length > 0 ) || ( uAgri.length > 0 ))){
                    setisloading(true);
                    setisVisible(false);
                    onRunExternalRQST({
                        method: "PUT",
                        url: `/services/service/sync/mtos`,
                        data: {
                            currentuser: global.user,
                            champs: uChamp,
                            agriculteurs: uAgri
                        }
                    }, (er, done) => {
                        if(done){
                            if(done['status'] === 200){
                                
                                if(uChamp.length >= 0){
                                    uChamp.forEach((c, i) => {
                                        onRunRawQRY({
                                            options: {},
                                            sql: `update __tbl_champs set issynched = 1 where id = ${c.id}`,
                                            table: "__tbl_champs"
                                        }, (e, d) => {
                                            if(d) console.log(" Champs updated => ", d);
                                        })
                                    })
                                    setlocalysyncC(true)
                                }else setlocalysyncC(false)

                                if(uAgri.length >= 0){
                                    uAgri.forEach((c, i) => {
                                        onRunRawQRY({
                                            options: {},
                                            sql: `update __tbl_agriculteurs set issynched = 1 where id = ${c.id}`,
                                            table: "__tbl_agriculteurs"
                                        }, (e, d) => {
                                            if(d) console.log(" Agriculteur updated => ", d);
                                        })
                                    })
                                    setlocalysyncA(true)
                                }else setlocalysyncA(false)

                                if(1){
                                    ref.current.tip({
                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, color: Colors.successColor }}>Synchronisation</Text>,
                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} la synchronisation a réussie avec succès !</Text>],
                                        btn: {
                                            text: 'OK !',
                                            style: {
                                                color: Colors.primaryColor,
                                                fontFamily: 'mons',
                                                fontSize: Dims.subtitletextsize
                                            },
                                            callback: () => {}
                                        }
                                    })
                                }

                                setisloading(false)

                            }else{
                                setisloading(false)
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur de synchronisation',
                                    text2: 'Le serveur de HewAgri ne peut être atteint !',
                                });
                            }
                        }else{
                            setisloading(false)
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur de synchronisation',
                                text2: 'Le serveur de HewAgri ne peut être atteint !',
                            });
                        }
                    })
                }else{
                    ref.current.tip({
                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, color: Colors.successColor }}>Synchronisation</Text>,
                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} la synchronisation a réussie avec succès !</Text>],
                        btn: {
                            text: 'OK !',
                            style: {
                                color: Colors.primaryColor,
                                fontFamily: 'mons',
                                fontSize: Dims.subtitletextsize
                            },
                            callback: () => {}
                        }
                    })
                }

            }else{
                setisVisible(true)
                Toast.show({
                    type: 'error',
                    text1: 'Erreur de synchronisation',
                    text2: 'Vérifiez la connexion internet puis réessayez !',
                });
            }
        })
    };

    const onSyncFromServerToMob = async () => {
        try{
            NetInfos.fetch().then(on => {
                if(on.isConnected){
                    setSAgri([]);
                    setSProv([]);
                    setSTerr([]);
                    setSVil([]);
                    setSCults([]);
                    
                    setisloading(true)
                    setisVisible(false)
                    onRunExternalRQST({
                        method: "PUT",
                        url: `/services/service/sync/stom`
                    }, (err, done) => {

                        if(done && done['status'] === 200){

                            setisloading(false)
                            const agris = done['data']['agriculteurs'];
                            const champs = done['data']['champs'];
                            const provinces = done['data']['provinces'];
                            const villages = done['data']['villages'];
                            const territoires = done['data']['territoires'];
                            const cultures = done['data']['cultures']; 

                            megaStorage({ 
                                data: cultures, 
                                dots: '?,?,?,?,?',
                                table: '__tbl_backup_cultures', 
                                columns: ['realid','ref','cultures', 'status','createdon'],
                                cb: (err, d) => {
                                    if(d) setSCults(d);
                                    else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur de synchronisation',
                                            text2: 'Les infos sur les cultures n\'ont pas été enregistrées ',
                                        });
                                    }
                                }
                            })

                            megaStorage({ 
                                data: agris, 
                                dots: '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?',
                                table: '__tbl_backup_agriculteurs', 
                                columns: ['realid','ref','nom','postnom','prenom','email','phone','genre','isfake','date_de_daissance','password','membrecooperative','status','idambassadeur','createdon'],
                                cb: (err, d) => {
                                    if(d) setSAgri(d);
                                    else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur de synchronisation',
                                            text2: 'Les infos sur les agriculteurs n\'ont pas été enregistrées ',
                                        });
                                    }
                                }
                            })

                            megaStorage({
                                data: provinces,
                                dots: '?,?,?,?',
                                table: `__tbl_backup_provinces`,
                                columns: ['realid','province','createdon','status'],
                                cb: (err, d) => {
                                    if(d) setSProv(d);
                                    else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur de synchronisation',
                                            text2: 'Les infos sur les provinces n\'ont pas été enregistrées ',
                                        });
                                    }
                                }
                            })

                            megaStorage({
                                data: territoires,
                                dots: '?,?,?,?,?',
                                table: `__tbl_backup_territoires`,
                                columns: ['realid','idprovince','territoire','createdon','status'],
                                cb: (err, d) => {
                                    if(d) setSTerr(d);
                                    else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur de synchronisation',
                                            text2: 'Les infos sur les territoires n\'ont pas été enregistrées ',
                                        }); 
                                    }
                                }
                            })

                            megaStorage({
                                data: villages,
                                dots: '?,?,?,?,?,?,?,?',
                                table: `__tbl_backup_villages`,
                                columns: ['realid','village','latitude','longitude','groupement', 'territoire', 'provincecode','status'],
                                cb: (err, d) => {
                                    if(d) setSVil(d);
                                    else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur de synchronisation',
                                            text2: 'Les infos sur les villages n\'ont pas été enregistrées ',
                                        }); 
                                    }
                                }
                            })

                            // ============= now synchonisation from mobile to server ==========
                            onSynchFromMobileToServer()

                        }else{
                            setisloading(false)
                        }
                    })
                }else{
                    setisVisible(true)
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur de synchronisation',
                        text2: 'Vérifiez la connexion internet puis réessayez !',
                    });
                }
            })
        }catch{ 
            Toast.show({
                type: 'error',
                text1: 'Erreur de synchronisation',
                text2: 'Une erreur vient de se produire lors de la synchronisation !',
            });
        }
    };

    const onLoadChampsLocalySaved = async () => {
        setisloading(true)
        await onRunRetrieveQRY({
            limit: 1000,
            table: `__tbl_champs`,
            clause: "where issynched = 0"
        }, (er, dn) => {
            setisloading(false)
            if(dn) setUChamp(dn)
        })
    };

    const onLoadAgricsLocalySaved = async () => {
        setisloading(true)
        await onRunRetrieveQRY({
            limit: 1000,
            table: `__tbl_agriculteurs`,
            clause: "where issynched = 0"
        }, (er, dn) => {
            setisloading(false)
            if(dn) setUAgri(dn)
        })
    };

    const startSynchronisation = async () => {
        onSyncFromServerToMob()
        // onSynchFromMobileToServer()
    };

    const onRefresh = async () => {
        onLoadChampsLocalySaved()
        onLoadAgricsLocalySaved()
    };

    React.useEffect(() => {
        onRefresh()
    }, []);

    return(
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <Title title={"Synchronisation"} subtitle={"Mis a jour et synchronisation des informations"} navigation={navigation} />
            <ScrollView
                contentContainerStyle={{ paddingBottom: "40%", marginTop: 0 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl 
                    refreshing={isloading}
                    onRefresh={onRefresh}
                    colors={[Colors.primaryColor]}
                />}
            >
                {canSynch && (
                    <>
                        <View style={{ width: "94%", alignSelf: "center", height: 135, marginTop: 10, paddingHorizontal: 20, borderRadius: 5, padding: 5, backgroundColor: Colors.pillColor }}>
                            <View style={{ marginVertical: 14 }}>
                                <Feather name="download-cloud" size={24} color={Colors.primaryColor} style={{ alignSelf: "center", marginVertical: 2 }} />
                                <Text style={{ fontFamily: "mons", textAlign: 'center', color: Colors.primaryColor }} >A recevoir</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 20 }}>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Agriculteurs</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{sAgri.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Provinces</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{sProv.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Territoires</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{sTerr.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Vilages</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{sVill.length}</Text>
                                </View>
                            </View>
                            <Divider />
                        </View>

                        <View style={{ width: "94%", alignSelf: "center", height: 135, marginTop: 10, paddingHorizontal: 20, borderRadius: 5, padding: 5, backgroundColor: Colors.pillColor }}>
                            <View style={{ marginVertical: 14 }}>
                                <Feather name="upload-cloud" size={24} color={Colors.dangerColor} style={{ alignSelf: "center", marginVertical: 2 }} />
                                <Text style={{ fontFamily: "mons", color: Colors.dangerColor, textAlign: "center" }}>A envoyer</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 20 }}>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Agriculteurs</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{uAgri.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Champs</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{uChamp.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Territoires</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{uTerr.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ textAlign: "center", fontFamily: "mons-e" }}>Vilages</Text>
                                    <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize }}>{uVill.length}</Text>
                                </View>
                            </View>
                            <Divider />
                        </View>
                    </>
                )}

                <View style={{ flex: 1, justifyContent: "center", paddingTop: 20 }}>
                    <View style={{width: "90%", alignSelf: "center"}}>
                        <View style={{ alignContent: "center", alignItems: "center", marginVertical: 10 }}>
                            { isloading ? <><Loader color={Colors.primaryColor} size={70} /></> : <Octicons name='sync' size={40} color={Colors.primaryColor} /> }
                        </View>
                        <Text style={{ textAlign: "center", paddingBottom: 6, marginTop: 20, fontFamily: "mons", fontSize: Dims.bigtitletextsize, }}>Synchronisation</Text>
                        <Text style={{ textAlign: "center", alignSelf: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Vous êtes sur le point de faire une synchronisation, ie. les informations que vous ne detenez pas dans votre mobile elles vont être sauvegardées, et celles que vous avez de plus elles vont etre deployées sur le serveur de <Text style={{ color: Colors.primaryColor, fontFamily: "mons" }} >{appname}</Text></Text>
                        <View style={{ marginTop: 20 }}>
                            <TouchableHighlight
                                underlayColor={ Colors.primaryColor }
                                onPress={() => { 
                                    if(canSynch) startSynchronisation()
                                    else setcanSync(true) 
                                    
                                }}
                                style={[ btn ]}
                                disabled={isloading}
                            >
                                {canSynch 
                                    ?
                                    (
                                        <>
                                            <Text style={{ fontFamily: "mons", paddingHorizontal: 10, color: Colors.whiteColor }}>
                                                {isloading ? 'Synchronisation encours ...' : 'Commencer la synchronisation'}
                                            </Text>
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <Text style={{ fontFamily: "mons", paddingHorizontal: 10, color: Colors.whiteColor }}>
                                                Verifiez les données
                                            </Text>
                                        </>
                                    )
                                }
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Spinner
                visible={isloading}
                textContent={
                    (
                        <View style={{ alignSelf: "center", width: 250}}>
                            <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize, color: Colors.whiteColor }}>Traitement</Text>
                            <Text style={{ fontFamily: "mons-e", color: Colors.whiteColor, textAlign: "center" }}>{output && output.length > 0 ? output : "le traitement est cours veuillez patienter ..."}</Text>
                        </View>
                    )
                }
                textStyle={{
                    color: Colors.whiteColor,
                    fontFamily: "mons"
                }}
            />
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
            <DialogBox ref={ref} isOverlayClickClose={false} />
            <Footer/>
        </View>
    )
}