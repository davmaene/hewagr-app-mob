import * as React from 'react';
import { RefreshControl, View, Text, ScrollView, TextInput, TouchableHighlight, SafeAreaView } from 'react-native';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { appcompanyname, appname, defaulDevise } from '../../assets/configs/configs';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { buttons, inputGroup, modal } from '../../assets/styles/Styles';
import { Dropdown } from 'react-native-element-dropdown';
import { onRunExternalRQST } from '../../services/communications';
import { Loader } from '../../components/Loader/comp.loader';
import Toast from 'react-native-toast-message';
import { datePlusSomeDays } from '../../assets/Helper/Helpers';
import moment from 'moment';
import DialogBox from 'react-native-dialogbox';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import { toastConfig } from '../../assets/Toast/Toastconfig';
import NetInfos from '@react-native-community/netinfo';

export const Souscription = ({ navigation, route }) => {

    const user = global && global['user'];
    const ID = user && user['realid'];
    const item = route && route['params'] && route['params']['item']
    const [isloading, setisloading] = React.useState(false);
    const [freq, setfreq] = React.useState(1);
    const [culvs, setculvs] = React.useState([]);
    const [cult, setcult] = React.useState(parseInt(item && item['id'] ? item['id'] : 0));
    const [types, settypes] = React.useState([]);
    const [type, settype] = React.useState("");
    const [champs, setchamps] = React.useState([]);
    const [champ, setchamp] = React.useState("");
    const [langues, setlangues] = React.useState([]);
    const [langue, setlangue] = React.useState("");
    const [isVisible, setisVisible] = React.useState(false);
    const [isVisibleC, setisVisibleC] = React.useState(false);
    const ref = React.useRef();
    const [output, setoutput] = React.useState("");

    const loadAgiculteurs = async () => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/agriculteurs/liste`
        }, (er, done) => {
            if(done && done['status'] === 200){
                const d = (done && done['data'] && done['data']['liste']);
                const tmp = [];
                d.forEach((v, i) => {
                    tmp.push({
                        id: v && v['id'],
                        nom: `${v && v['nom']} ${v && v['postnom']} | ${v && v['phone']}`
                    })
                });
                setculvs(tmp);
                setisloading(false);
            }else{
                setisloading(false)
            }
        })
    };

    const loadChamps = async ({ idagriculteur }) => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/champs/agri/liste/${idagriculteur}`
        }, (er, done) => {
            console.log(" Log => ", done);
            if(done && done['status'] === 200){
                setisloading(false)
                setchamps(done && done['data'] && done['data']['liste']);
            }else{
                setisloading(false)
            }
        })
    };

    const loadTypeSouscriptions = async () => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/types/liste`
        }, (er, done) => {
            if(done && done['status'] === 200){
                setisloading(false)
                settypes(done && done['data'] && done['data']['liste']);
            }else{
                setisloading(false)
            }
        })
    };

    const loadLangues = async () => {
        setisloading(true)
        await onRunExternalRQST({
            method: "GET",
            url: `/langues/liste`
        }, (er, done) => {
            if(done && done['status'] === 200){
                // console.log(done);
                setisloading(false)
                setlangues(done && done['data'] && done['data']['liste']);
            }else{
                setisloading(false)
            }
        })
    };

    const payDirectely = async () => {
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                setisloading(true)
                setisVisible(false)
                onRunExternalRQST({
                    url: `/souscriptions/souscription/add`,
                    method: "POST",
                    data: {
                        datedebut: moment().format('l'),
                        datefin: datePlusSomeDays({ days: type }),
                        type,
                        method: 'direct',
                        frequence: freq,
                        idambassadeur: ID,
                        idagriculteur: cult,
                        idlangue: langue,
                        idchamps: champ,
                        currency: defaulDevise
                    },
                }, ( err, done ) => {
                    if(done){
                        setisVisible(false)
                        switch (done && done['status']) {
                            case 201:
                                setisloading(false);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Souscription réussie',
                                    text2: `Votre souscription a été traité avec succès !`,
                                });
                                ref.current.tip({
                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Souscription</Text>,
                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Votre souscription à été pris en compte, par {appcompanyname} et une confirmation de paiement va bientôt être envoyé par message !</Text>],
                                    btn: {
                                        text: `D'accord`,
                                        style: {
                                            color: Colors.primaryColor,
                                            fontFamily: 'mons',
                                            fontSize: Dims.subtitletextsize
                                        },
                                        callback: () => navigation.navigate("tabs")
                                    }
                                })
                                break;
                            case 200:
                                    setisloading(false);
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Souscription réussie',
                                        text2: `Votre souscription a été traité avec succès !`,
                                    });
                                    ref.current.tip({
                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Souscription</Text>,
                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Votre souscription à été pris en compte, par {appcompanyname} et une confirmation de paiement va bientôt être envoyé par message !</Text>],
                                        btn: {
                                            text: `D'accord`,
                                            style: {
                                                color: Colors.primaryColor,
                                                fontFamily: 'mons',
                                                fontSize: Dims.subtitletextsize
                                            },
                                            callback: () => navigation.navigate("tabs")
                                        }
                                    })
                                    break;
                            case 401:
                                setisloading(false);
                                Toast.show({
                                    type: 'error',
                                    text1: 'Souscription a échoué !',
                                    text2: `Votre souscription a échoué !`,
                                });
                                ref.current.confirm({
                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Echec Souscription</Text>,
                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Il semble que les informations que vous avez entrer soient incorrectes, Assurez-vous d'avoir entrer des informations correctes avant de procéder à la souscription</Text>],
                                    cancel: {
                                        text: `Annuler`,
                                        style: {
                                            color: Colors.darkColor,
                                            fontFamily: 'mons-e',
                                            fontSize: Dims.subtitletextsize
                                        },
                                    },
                                    ok: {
                                        text: `Réessayer la souscription `,
                                        style: {
                                            color: Colors.primaryColor,
                                            fontFamily: 'mons',
                                            fontSize: Dims.subtitletextsize
                                        },
                                        callback: () => onSendForm()
                                    },
                                })
                            break;
                        
                            default:
                                setisloading(false)
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur de souscription !',
                                    text2: `Une erreur vient de se produire !`,
                                });
                                break;
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur de souscription !',
                            text2: `Une erreur vient de se produire !`,
                        });
                        setisloading(false);
                        setisVisible(false);
                    }
                })
            }else{
                setisVisibleC(true)
            }
        })
    };

    const payWithPackage = async () => {
        setisVisible(false)
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                setisloading(true)
                onRunExternalRQST({
                    method: "GET",
                    url: `/paiements/paiement/get/package/ambassador/${ID}`
                }, (e, done) => {
                    if(done){
                        setisloading(false);
                        setisVisible(false);
                        try {
                            switch (done && done['status']) {
                                case 200:
                                    const solde = done && done['data']['package'];
                                    if(parseFloat(solde) > type) {
                                        setisloading(true);
                                        setoutput("Paiement en cours, veuillez patienter un moment le temps que nous procedons au paiement !");
                                        onRunExternalRQST({
                                            url: `/souscriptions/souscription/add`,
                                            method: "POST",
                                            data: {
                                                datedebut: moment().format('l'),
                                                datefin: datePlusSomeDays({ days: type }),
                                                type,
                                                method: 'package',
                                                frequence: freq,
                                                idambassadeur: ID,
                                                idagriculteur: cult,
                                                idlangue: langue,
                                                idchamps: champ,
                                                currency: defaulDevise
                                            },
                                        }, ( err, done ) => {
                                            console.log(" Message from server => ", done);
                                            switch (done && done['status']) {
                                                case 201:
                                                    setisloading(false);
                                                    Toast.show({
                                                        type: 'success',
                                                        text1: 'Souscription réussie',
                                                        text2: `Votre souscription a été traité avec succès !`,
                                                    });
                                                    ref.current.tip({
                                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Souscription</Text>,
                                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Votre souscription à été pris en compte, par {appcompanyname} et une confirmation de paiement va bientôt être envoyé par message !</Text>],
                                                        btn: {
                                                            text: `D'accord`,
                                                            style: {
                                                                color: Colors.primaryColor,
                                                                fontFamily: 'mons',
                                                                fontSize: Dims.subtitletextsize
                                                            },
                                                            callback: () => navigation.navigate("tabs")
                                                        }
                                                    })
                                                    break;
                                                case 200:
                                                        setisloading(false);
                                                        Toast.show({
                                                            type: 'success',
                                                            text1: 'Souscription réussie',
                                                            text2: `Votre souscription a été traité avec succès !`,
                                                        });
                                                        ref.current.tip({
                                                            title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Souscription | <Text style={{ color: Colors.primaryColor }}> Réussie</Text></Text>,
                                                            content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Votre souscription à été réussie avec succès, votre nouveau solde de paquet est <Text style={{ fontFamily: "mons" }}>{done && done['data'] && done['data']['package']} ({done && done['data'] && (done['data']['package'] * 30)} SMS)</Text></Text>],
                                                            btn: {
                                                                text: `D'accord`,
                                                                style: {
                                                                    color: Colors.primaryColor,
                                                                    fontFamily: 'mons',
                                                                    fontSize: Dims.subtitletextsize
                                                                },
                                                                callback: () => navigation.navigate("tabs")
                                                            }
                                                        })
                                                        break;
                                                case 401:
                                                    setisloading(false);
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Souscription a échoué !',
                                                        text2: `Votre souscription a échoué !`,
                                                    });
                                                    ref.current.confirm({
                                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Echec d'abonnement</Text>,
                                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Il semble que les informations que vous avez entrer soient incorrectes, Assurez-vous d'avoir entrer des informations correctes avant de procéder à la souscription</Text>],
                                                        cancel: {
                                                            text: `Annuler`,
                                                            style: {
                                                                color: Colors.darkColor,
                                                                fontFamily: 'mons-e',
                                                                fontSize: Dims.subtitletextsize
                                                            },
                                                        },
                                                        ok: {
                                                            text: `Réessayer la souscription `,
                                                            style: {
                                                                color: Colors.primaryColor,
                                                                fontFamily: 'mons',
                                                                fontSize: Dims.subtitletextsize
                                                            },
                                                            callback: () => onSendForm()
                                                        },
                                                    })
                                                break;
                                            
                                                default:
                                                    setisloading(false)
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de souscription !',
                                                        text2: `Une erreur vient de se produire !`,
                                                    });
                                                    break;
                                            }
                                        })
                                    }else{
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Solde insuffisant',
                                            text2: `Une erreur est survenu lors du paiement avec paquet !`,
                                        }); 
                                    }
                                    break;
                                case 400:
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Solde insuffisant',
                                        text2: `Une erreur est survenu lors du paiement avec paquet !`,
                                    });
                                    break;
                                default:
                                    console.log(" ========================> ", typeof done['status']);
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Chargement erreur !',
                                        text2: `Une erreur est survenu lors du paiement avec paquet !`,
                                    });
                                    break;
                            }
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Chargement erreur !',
                                text2: `Une erreur est survenu lors du paiement avec paquet !`,
                            });
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur de paiement !',
                            text2: `Une erreur est survenu lors du paiement avec paquet !`,
                        });
                        setisVisible(false);
                        setisloading(false);
                    }
                })
            }else{
                setisloading(false)
                setisVisibleC(true)
            }
        })
    };

    const onSendForm = () => {
        if(freq.toString().length > 0){
            if(champ.toString().length > 0){
                if(cult.toString().length > 0){
                    if(type.toString().length > 0){
                        if(langue.toString().length > 0){
                            setisVisible(true);
                        }else{
                            Toast.show({
                                type: 'error',
                                text1: 'Champs obligatoire',
                                text2: `Séléctionner une langue !`,
                            });
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Champs obligatoire',
                            text2: `Séléctionner le type d'abonement !`,
                        });
                    }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Champs obligatoire',
                        text2: `Séléctionner un agriculteur`,
                    });
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Champs obligatoire',
                    text2: `Séléctionner un champs`,
                });
            }
        }else{
            Toast.show({
                type: 'error',
                text1: 'Champs obligatoire',
                text2: 'Séléctionner la frequence des messages',
            });
        }
    };

    const onRefresh = () => {
        loadAgiculteurs();
        loadLangues();
        loadTypeSouscriptions();
    };

    const BottomSheetDialog = ({ navigation, visible, title: { text, color }, subTitle: { sText, sColor } }) => {
        return(
            <Modal
                isVisible={visible}
                animationIn={"slideInUp"}
                animationOut={"slideInDown"}
                onBackButtonPress={() => { setisVisibleC(!isVisibleC) }}
                onBackdropPress={() => { setisVisibleC(!isVisibleC) }}
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

    React.useEffect(() => {

        NetInfos.addEventListener(on => {
            if(on.isConnected){
                setisVisibleC(false)
                if(item && item['id']) loadChamps({ idagriculteur: parseInt(item && item['id'] ? item['id'] : 0) })
                onRefresh();
            }else{
                setisVisibleC(true)
            }
        });

    }, []);

    return(
        <>
            <Title 
                navigation={navigation}
                title={"Abonnement info météo"} 
                subtitle={"Formulaire de souscrition"} 
            />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingTop: Dims.borderradius }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingBottom: "50%"
                    }}
                    refreshControl={
                        <RefreshControl
                            colors={[ Colors.primaryColor ]}
                            refreshing={isloading}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={{width: "90%", alignSelf: "center", paddingVertical: 10}}>
                        <Text style={{ paddingBottom: 6, marginTop: 0, fontFamily: "mons-b", fontSize: Dims.titletextsize }}>Abonenment | <Text style={{ color: Colors.primaryColor }}>météo agricole</Text></Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Formulaire d'un nouvel abonenment | remplissez les champs pour pouvoir l'ajouter dans le système </Text>
                    </View>
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <Divider />
                    </View>
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor,  marginTop: 10, paddingBottom: 100 }}>
                        <View style={{width: "90%", alignSelf: "center", marginTop: 0 }}>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Agriculteur <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        {item && item['id'] 
                                        ?
                                            <TextInput 
                                                editable={false}
                                                style={[ inputGroup.input, { fontFamily: "mons", width: "100%", paddingRight: 20, paddingLeft: 20, textTransform: "capitalize" }]} 
                                                value={`${item && item['nom']} ${item && item['postnom']} | ${item && item['phone']}`} 
                                            />
                                        :
                                            <Dropdown
                                                style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                                placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                containerStyle={{}}
                                                selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                data={culvs}
                                                search
                                                maxHeight={ 200 }
                                                labelField="nom"
                                                valueField="id"
                                                placeholder={'Séléctionner un agriculteur'}
                                                searchPlaceholder="Recherche ..."
                                                onChange={item => {
                                                    setcult(item.id);
                                                    loadChamps({ idagriculteur: item.id });
                                                }}
                                            />
                                        }
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <Feather name="user" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* ---------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Champs <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={champs}
                                            search
                                            maxHeight={ 200 }
                                            labelField="champs"
                                            valueField="id"
                                            placeholder={'Séléctionner un champs'}
                                            searchPlaceholder="Recherche ..."
                                            onChange={item => {
                                                console.log(" Selected item is => ", item);
                                                setchamp(item.id);
                                            }}
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { } ]}>
                                        <MaterialIcons name="leak-add" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* ------------------------ */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Type d'abonenment  <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={types}
                                            search
                                            maxHeight={200}
                                            labelField="type"
                                            valueField="id"
                                            placeholder={'Séléctionner le type d\'abo...'}
                                            searchPlaceholder="Recherche ..."
                                            onChange={item => {
                                                // alert(item.value)
                                                settype(item.id);
                                            }}
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialIcons name="merge-type" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* ------------------------ */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Langue  <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={langues}
                                            search
                                            maxHeight={ 200 }
                                            labelField="langue"
                                            valueField="id"
                                            placeholder={'Séléctionner une langue'}
                                            searchPlaceholder="Recherche ..."
                                            onChange={item => {
                                                    // alert(item.value)
                                                    setlangue(item.id);
                                                }
                                            }
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <Entypo name="language" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    onPress={() => {
                                        onSendForm()
                                    }}
                                    disabled={isloading}
                                    underlayColor={ Colors.primaryColor }
                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    {isloading ? <Loader /> : <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Confirmer l'abonement</Text> }
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Footer/>
            </View>

            <View style={{ padding: 0, alignSelf: "center", overflow: "hidden", borderTopStartRadius: Dims.borderradius, borderTopEndRadius: Dims.borderradius, backgroundColor: Colors.whiteColor }}>
                <Modal
                    style={{ position: "absolute", width: "95%", bottom: -20, height: 80, overflow: "hidden", backgroundColor: Colors.whiteColor, alignSelf: "center", borderTopStartRadius: Dims.borderradius + 30, borderTopEndRadius: Dims.borderradius + 30 }}
                    isVisible={isVisible}
                    onBackButtonPress={() => { 
                        setisVisible(false)
                    }}
                    onBackdropPress={() => { 
                        setisVisible(false)
                    }}
                    onDismiss={() => { 
                        setisVisible(false)
                    }}
                >
                    <View style={{ padding: 2, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "space-around" }}>
                        <TouchableHighlight 
                            underlayColor={Colors.primaryColor}
                            onPress={() => {
                                payWithPackage()
                            }}
                            style={{ backgroundColor: Colors.pillColor, padding: 5, width: "45%", borderRadius: 0, borderTopStartRadius: Dims.borderradius + 20 }}
                        >
                            <View style={{ flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center", paddingVertical: 7  }}>
                                <Feather name="package" size={Dims.iconsize + 5} color={Colors.primaryColor} />
                                <Text style={{ fontFamily: "mons-e", fontSize: 10, paddingTop: 5 }} >Paiement par paquet</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={Colors.primaryColor}
                            onPress={() => {
                                payDirectely()
                            }}
                            style={{ backgroundColor: Colors.pillColor, padding: 5, width: "45%", borderRadius: 0, borderTopEndRadius: Dims.borderradius + 20 }}
                        >
                            <View style={{ flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center", paddingVertical: 7  }}>
                                {/* <FontAwesome5 name="money-bill-alt"  /> */}
                                <MaterialIcons name="send-to-mobile" size={Dims.iconsize + 5} color={Colors.primaryColor} />
                                <Text style={{ fontFamily: "mons-e", fontSize: 10, paddingTop: 5 }} >Paiement par mobile money</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>
            
            <DialogBox ref={ref} isOverlayClickClose={false} />
            <BottomSheetDialog
                navigation={navigation} 
                visible={isVisibleC} 
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
            <Spinner
                visible={isloading}
                textContent={
                    (
                        <View style={{ alignSelf: "center", width: 250}}>
                            <Text style={{ textAlign: "center", fontFamily: "mons", fontSize: Dims.titletextsize, color: Colors.whiteColor }}>Chargement</Text>
                            <Text style={{ fontFamily: "mons-e", color: Colors.whiteColor, textAlign: "center" }}>{output && output.length > 0 ? output : "le traitement est cours veuillez patienter ..."}</Text>
                        </View>
                    )
                }
                textStyle={{
                    color: Colors.whiteColor,
                    fontFamily: "mons"
                }}
            />
        </>
    )
}