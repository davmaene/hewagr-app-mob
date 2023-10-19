import * as React from 'react';
import { RefreshControl, View, Text, ScrollView, TextInput, TouchableHighlight } from 'react-native';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { appname } from '../../assets/configs/configs';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { customStyles, inputGroup } from '../../assets/styles/Styles';
import { Dropdown } from 'react-native-element-dropdown';
import { onRunExternalRQST, onRunInsertQRY } from '../../services/communications';
import Toast from 'react-native-toast-message';
import DialogBox from 'react-native-dialogbox';
import { Loader } from '../../components/Loader/comp.loader';
import { fillphone, randomString } from '../../assets/Helper/Helpers';
import StepIndicator from 'react-native-step-indicator';
import NetInfos from '@react-native-community/netinfo';

export const Addcultivateurscreen = ({ navigation }) => {

    const [ON, setisON] = React.useState(false);
    const [isloading, setisloading] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);
    const [isFocusg, setIsFocusg] = React.useState(false);
    const [hosp, sethosp] = React.useState(null);
    const [gender, setgender] = React.useState("");
    const [genders, setgeders] = React.useState([
        {
            id: 1,
            value: "Masculin",
            rv: "M"
        },
        {
            id: 2,
            value: "Feminin",
            rv: "F"
        }
    ]);
    const [hosps, sethops] = React.useState([]);
    const [zones, setzones] = React.useState([]);
    const [zone, setzone] = React.useState("");
    const [nom, setnom] = React.useState("");
    const [postnom, setpostnom] = React.useState("");
    const [prenom, setprenom] = React.useState("");
    const [email, setemail] = React.useState("");
    const [phone, setphone] = React.useState("");
    const [addphysique, setaddphysique] = React.useState("");
    const user = global && global['user'];
    const ref = React.useRef();
    const [d, setd] = React.useState("");
    const [m, setm] = React.useState("");
    const [y, sety] = React.useState("");
    const labels = ["Cart", "Delivery Address", "Order Summary", "Payment Method", "Track"];
    const [currentPosition, setcurrentPosition] = React.useState(0);

    const [provinces, setprovinces] = React.useState([]);
    const [territoires, setterritoires] = React.useState([]);
    const [villages, setvillages] = React.useState([]);

    const [idprovince, setprovince] = React.useState("");
    const [idterritoire, setterritoire] = React.useState("");
    const [idvillage, setvillage] = React.useState("");

    const loadCooperatives = async () => {
        setisloading(true);
        await onRunExternalRQST({
            method: "GET",
            url: `/cooperatives/liste`
        }, (er, liste) => {
            if (liste && liste['status'] === 200) {
                sethops(liste && liste['data'] && liste['data']['liste'])
                setisloading(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Les chargement de cooperative à échoché!',
                });
                setisloading(false);
            }
        })
    };

    const loadZones = async () => {
        setisloading(true);
        onRunExternalRQST({
            method: "GET",
            url: `/zones/liste`
        }, (err, done) => {
            if (done && done['status'] === 200) {
                const d = done && done['data'] && done['data']['liste'];
                const tmp = [];
                d.forEach((val, i) => {
                    const v = val && val['__tbl_village'];
                    console.log(" Village is => ", val);
                    tmp.push({
                        id: val && val['id'],
                        value: `Zone : ${val && val['zoneproduction']} / Village : ${v && v['village']}`
                    });
                })
                setisloading(false);
                setzones(tmp);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Echec chargement des informations sur les zones de production !',
                });
                setisloading(false);
            }
        })
    };

    const onSubmit = async () => {
        if (nom && nom.length >= 2) {
            if (postnom && postnom.length >= 2) {
                if (phone && phone.length > 8) {
                    if (gender.length) {
                        if (d.length > 0 && m.length > 0 && y.length > 0) {

                            if (parseInt(d) > 0 && parseInt(d) <= 31);
                            else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Le jour de naissance doit etre inferieur à 31',
                                    text2: "Le jour de naissance doit etre inferieur à 31",
                                });
                            }

                            if (parseInt(m) > 0 && parseInt(m) <= 12);
                            else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Le jour mois de naissance doit etre inferieur à 12',
                                    text2: "Le jour mois de naissance doit etre inferieur à 12",
                                });
                            }

                            if (y.length >= 4 && (parseInt(y) > 0 && parseInt(y) <= new Date().getFullYear()));
                            else {
                                Toast.show({
                                    type: 'error',
                                    text1: "Mauvais format de l'année  de naissance",
                                    text2: "Mauvais format de l'année  de naissance",
                                });
                            }

                            if (idprovince.toString().length > 0) {
                                if (idterritoire.toString().length > 0) {
                                    if (idvillage.toString().length > 0) {
                                        setisloading(true)
                                        const data = {
                                            adresse: addphysique,
                                            zone,
                                            nom,
                                            postnom,
                                            prenom,
                                            email,
                                            date_de_daissance: `${d}/${m}/${y}`,
                                            genre: gender,
                                            phone: fillphone({ phone }),
                                            idambassadeur: user && user['realid'],
                                            membrecooperative: hosp,
                                            idprovince,
                                            idterritoire,
                                            idvillage
                                        };
                                        if (ON) {
                                            await onRunExternalRQST({
                                                method: "POST",
                                                url: `/agriculteurs/agriculteur/register`,
                                                data
                                            }, (er, done) => {
                                                if (done) {
                                                    setisloading(false);
                                                    switch (done && done['status']) {
                                                        case 200:
                                                            Toast.show({
                                                                type: 'success',
                                                                text1: 'Enregistrement réussi',
                                                                text2: "L'agriculteur a été ajouter avec succès !",
                                                            });

                                                            ref.current.pop({
                                                                title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Agriculteur ajouté</Text>,
                                                                content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >L'agriculteur a été ajouter succès ! les informations relatives consernant {nom} {postnom} ont été envoyé au serveur de {appname} avec succès ! </Text>],
                                                                btns: [
                                                                    {
                                                                        text: 'Ajouter un champs à cet agriculteur',
                                                                        style: {
                                                                            color: Colors.primaryColor,
                                                                            fontFamily: 'mons',
                                                                            fontSize: Dims.subtitletextsize
                                                                        },
                                                                        callback: () => { return navigation.replace("addchamps", { item: done['data'] }) }
                                                                    },
                                                                    {
                                                                        text: 'Visualiser cet agriculteur',
                                                                        style: {
                                                                            color: Colors.primaryColor,
                                                                            fontFamily: 'mons',
                                                                            fontSize: Dims.subtitletextsize

                                                                        },
                                                                        callback: () => { return navigation.replace("agriculteur", { item: done['data'] }) }
                                                                    },
                                                                    {
                                                                        text: 'Annuler',
                                                                        style: {
                                                                            color: Colors.darkColor,
                                                                            fontFamily: "mons-e",
                                                                            fontSize: Dims.subtitletextsize
                                                                        },
                                                                        callback: () => { return navigation.replace("tabs") }
                                                                    }
                                                                ]
                                                            })
                                                            break;
                                                        case 503:
                                                            Toast.show({
                                                                type: 'error',
                                                                text1: 'Erreur',
                                                                text2: 'Le numéro de téléphone est déjà utilisé par un autre compte !',
                                                            });
                                                            break;
                                                        case 405:
                                                            Toast.show({
                                                                type: 'error',
                                                                text1: 'Erreur',
                                                                text2: `${done && done['data']}`,
                                                            });
                                                            break;
                                                        default:
                                                            Toast.show({
                                                                type: 'error',
                                                                text1: 'Erreur',
                                                                text2: `${done && done['message']}`,
                                                            });
                                                            break;
                                                    }
                                                } else {
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur',
                                                        text2: 'Une erreur inconnue vient de se produire !',
                                                    });
                                                    setisloading(false)
                                                }
                                            })
                                        } else {
                                            await onRunInsertQRY({
                                                options: {},
                                                table: '__tbl_agriculteurs',
                                                values: [`${randomString()}`, `${data.nom}`, `${data.postnom}`, `${data.prenom}`, `${data.email}`, `${data.phone}`, `${data.genre}`, `${0}`, `${data.date_de_daissance}`, `${randomString()}`, `${data.membrecooperative}`, 1, `${data.idambassadeur}`, `${new Date().toLocaleString()}`, 0],
                                                dot: "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?",
                                                columns: `'ref','nom','postnom','prenom','email','phone','genre','isfake','date_de_daissance','password','membrecooperative','status','idambassadeur','createdon','issynched'`,
                                            }, (err, done) => {
                                                if (done) {
                                                    Toast.show({
                                                        type: 'success',
                                                        text1: 'Enregistrement réussi',
                                                        text2: "L'agriculteur a été ajouter avec succès !",
                                                    });

                                                    ref.current.pop({
                                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Agriculteur ajouté</Text>,
                                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >L'agriculteur a été ajouter succès ! les informations relatives consernant {nom} {postnom} ont été envoyé au serveur de {appname} avec succès ! </Text>],
                                                        btns: [
                                                            {
                                                                text: 'Ajouter un champs à cet agriculteur',
                                                                style: {
                                                                    color: Colors.primaryColor,
                                                                    fontFamily: 'mons',
                                                                    fontSize: Dims.subtitletextsize
                                                                },
                                                                callback: () => { return navigation.replace("addchamps", { item: done }) }
                                                            },
                                                            {
                                                                text: 'Visualiser cet agriculteur',
                                                                style: {
                                                                    color: Colors.primaryColor,
                                                                    fontFamily: 'mons',
                                                                    fontSize: Dims.subtitletextsize

                                                                },
                                                                callback: () => { return navigation.replace("agriculteur", { item: done }) }
                                                            },
                                                            {
                                                                text: 'Annuler',
                                                                style: {
                                                                    color: Colors.darkColor,
                                                                    fontFamily: "mons-e",
                                                                    fontSize: Dims.subtitletextsize
                                                                },
                                                                callback: () => { return navigation.replace("tabs") }
                                                            }
                                                        ]
                                                    })
                                                } else {
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de sauvegarde',
                                                        text2: 'Une erreur de sauvegarde vient de se produire',
                                                    });
                                                }
                                            })
                                        }
                                    } else {
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Village',
                                            text2: 'Vous devez selectionner un village',
                                        });
                                    }
                                } else {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Territoire',
                                        text2: 'Vous devez selectionner un territoire',
                                    });
                                }

                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Province',
                                    text2: 'Vous devez selectionner une province',
                                });
                            }

                        } else {
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Entrer la date de naissance !',
                            });
                        }
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Séléctionner le genre',
                        });
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Le numéro de téléphone doit avoir au minimum 9 caractères !',
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Entre le postnom',
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Entrer le nom',
            });
        }
    };

    const resetForm = () => {
        loadCooperatives();
        setnom("");
        setpostnom("");
        setphone("");
        setemail("");
        setprenom("");
    };

    const loadTerritoires = async ({ idprovince }) => {
        setisloading(true);
        if (ON)
            onRunExternalRQST({
                method: "GET",
                url: `/territoires/liste/by/${idprovince}`
            }, (err, done) => {
                if (done && done['status'] === 200) {
                    setisloading(false);
                    setterritoires(done && done['data'] && done['data']['liste'])
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Echec chargement des informations sur les territoires !',
                    });
                    setisloading(false);
                }
            })
        else {
            // alert(1)
            await onRunRetrieveQRY({ table: "__tbl_backup_territoires", limit: 2000, clause: ` where idprovince = '${idprovince}'` }, (er, done) => {
                if (done && done['length'] > 0) {
                    setisloading(false)
                    setterritoires(done)
                } else setisloading(false)
            });
        }
    };

    const loadProvinces = async () => {
        setisloading(true);
        // if (ON)
        onRunExternalRQST({
            method: "GET",
            url: `/provinces/liste`
        }, (err, done) => {
            if (done && done['status'] === 200) {
                setisloading(false);
                setprovinces(done && done['data']['liste']);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Echec chargement des informations sur les provinces !',
                });
                setisloading(false);
            }
        })
        // else
        //     await onRunRetrieveQRY({ table: "__tbl_backup_provinces", limit: 2000 }, (er, done) => {
        //         if (done && done['length'] > 0) {
        //             setprovinces(done)
        //             setisloading(false)
        //         } else setisloading(false)
        //     });
    };

    const loadVillages = async ({ idterritoire }) => {
        setisloading(true);
        // if (ON)
        onRunExternalRQST({
            method: "GET",
            url: `/villages/liste/byterritory/${idterritoire}`
        }, (err, done) => {
            if (done && done['status'] === 200) {
                setisloading(false);
                setvillages(done && done['data']['liste']);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Echec chargement des informations sur les provinces !',
                });
                setisloading(false);
            }
        })
        // else
        //     await onRunRetrieveQRY({ table: "__tbl_backup_villages", clause: ` where territoire = '${idterritoire}'`, limit: 2000 }, (er, done) => {
        //         if (done && done['length'] > 0) {
        //             setvillages(done)
        //             setisloading(false)
        //         } else setisloading(false)
        //     });
    };

    const __onLoadInfos = async () => {
        loadProvinces();
        loadCooperatives();
        loadZones();
    }

    React.useEffect(() => {
        setisON(true)

        __onLoadInfos()
        NetInfos.addEventListener(on => {
            if (on.isConnected) {
                setisON(true)
                loadCooperatives();
                loadZones();
            } else setisON(false)
        })
    }, [])

    return (
        <>
            <Title title={"Enregistrement agriculteur"} subtitle={"Formulaire ajout cultivateur | Agriculteur"} navigation={navigation} />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            colors={[Colors.primaryColor]}
                            refreshing={isloading}
                            onRefresh={resetForm}
                        />
                    }
                >
                    <View style={{ width: "90%", alignSelf: "center", paddingVertical: 10 }}>
                        <Text style={{ paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.titletextsize }}>Ajout d'un agriculteur</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Formulaire d'ajout d'un nouvel agriculteur de <Text style={{ color: Colors.primaryColor, fontFamily: "mons" }}>{appname}</Text> | remplissez les champs pour pouvoir l'ajouter dans le système </Text>
                    </View>
                    <View style={{ width: "100%", alignSelf: "center" }}>
                        {/* <Divider style={{ marginVertical: 10 }} /> */}
                        <StepIndicator
                            customStyles={customStyles}
                            currentPosition={currentPosition}
                            // labels={labels}
                            renderLabel={false}
                            stepCount={3}
                            onPress={(step) => {
                                setcurrentPosition(step)
                            }}
                        />
                        <Divider style={{ marginVertical: 25 }} />
                    </View>
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, marginTop: 0, paddingBottom: 100 }}>
                        <View style={{ width: "90%", alignSelf: "center", marginTop: 0 }}>
                            {/* ============================================================================= */}
                            {currentPosition === 0 &&
                                (
                                    <View style={{}}>
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 0 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nom <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <TextInput
                                                        value={nom}
                                                        onChangeText={t => setnom(t)}
                                                        placeholder='Nom'
                                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <FontAwesome name="user" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* ------------------------ */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Postnom <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <TextInput
                                                        value={postnom}
                                                        onChangeText={t => setpostnom(t)}
                                                        placeholder='Postnom'
                                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <FontAwesome name="user" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Prenom | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <TextInput
                                                        onChangeText={t => setprenom(t)}
                                                        value={prenom}
                                                        placeholder='Prenom ...'
                                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <FontAwesome name="user" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                    </View>
                                )
                            }
                            {/* =============================================================================== */}
                            {currentPosition === 1 &&
                                (
                                    <View>
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Date de naissance Jour | Mois | Année <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={[inputGroup.container, { borderWidth: 0, height: Dims.inputTextHeight + 2, justifyContent: "center", overflow: "visible", paddingVertical: 0 }]}>
                                                <View style={[inputGroup.inputcontainer, { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 2 }]}>
                                                    <View style={[inputGroup.container, { width: "32%", backgroundColor: Colors.pillColor, alignContent: "center", alignItems: "center", height: "100%", justifyContent: "center" }]}>
                                                        <TextInput
                                                            value={d}
                                                            onChangeText={t => setd(t)}
                                                            keyboardType={"numeric"}
                                                            maxLength={2}
                                                            placeholder='Jour'
                                                            style={{ backgroundColor: Colors.pillColor, textAlign: "center", height: "100%", width: "100%", paddingHorizontal: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        />
                                                    </View>
                                                    <View style={[inputGroup.container, { width: "32%", backgroundColor: Colors.pillColor, alignContent: "center", alignItems: "center", height: "100%", justifyContent: "center" }]}>
                                                        <TextInput
                                                            value={m}
                                                            maxLength={2}
                                                            keyboardType={"numeric"}
                                                            onChangeText={t => setm(t)}
                                                            placeholder='Mois'
                                                            style={{ backgroundColor: Colors.pillColor, textAlign: "center", height: "100%", width: "100%", paddingHorizontal: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        />
                                                    </View>
                                                    <View style={[inputGroup.container, { width: "32%", backgroundColor: Colors.pillColor, alignContent: "center", alignItems: "center", height: "100%", justifyContent: "center" }]}>
                                                        <TextInput
                                                            keyboardType={"numeric"}
                                                            value={y}
                                                            maxLength={4}
                                                            onChangeText={t => sety(t)}
                                                            placeholder='Année'
                                                            style={{ backgroundColor: Colors.pillColor, textAlign: "center", height: "100%", width: "100%", paddingHorizontal: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={[inputGroup.iconcontainer, { borderBottomRightRadius: Dims.borderradius, borderTopRightRadius: Dims.borderradius }]}>
                                                    <MaterialIcons name="date-range" size={Dims.iconsize} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Numéro de téléphone <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <TextInput
                                                        keyboardType='phone-pad'
                                                        onChangeText={t => setphone(t)}
                                                        value={phone}
                                                        placeholder='Numéro de téléphone'
                                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <Entypo name="phone" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse email  | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <TextInput
                                                        onChangeText={t => setemail(t)}
                                                        value={email}
                                                        keyboardType={"email-address"}
                                                        placeholder="Entrer l'adresse mail"
                                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <MaterialIcons name="email" size={Dims.iconsize} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                    </View>
                                )
                            }
                            {/* ============================================================================== */}
                            {currentPosition === 2 &&
                                (
                                    <View>
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse physique  | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <TextInput
                                                        onChangeText={t => setaddphysique(t)}
                                                        value={addphysique}
                                                        keyboardType={"default"}
                                                        placeholder="Entrer l'adresse physique"
                                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <Entypo name="address" size={Dims.iconsize} color={Colors.primaryColor} />
                                                    {/* <MaterialIcons name="4k" size={ Dims.iconsize } color={ Colors.primaryColor } /> */}
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Genre <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <Dropdown
                                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                        containerStyle={{}}
                                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        data={genders}
                                                        maxHeight={200}
                                                        labelField="value"
                                                        valueField="id"
                                                        placeholder={'Séléctionner le genre'}
                                                        onChange={
                                                            item => {
                                                                setgender(item.rv);
                                                            }
                                                        }
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <MaterialCommunityIcons name="gender-male-female" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Coopérative | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text> </Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <Dropdown
                                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%" }]}
                                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                        containerStyle={{}}
                                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        data={hosps}
                                                        search
                                                        maxHeight={200}
                                                        labelField="cooperative"
                                                        valueField="id"
                                                        placeholder={!isFocus ? 'Séléctionner une coopérative' : '...'}
                                                        searchPlaceholder="Recherche ..."
                                                        // value={hosp}
                                                        onFocus={() => setIsFocus(true)}
                                                        onBlur={() => setIsFocus(false)}
                                                        onChange={item => {
                                                            // alert(item.value)
                                                            sethosp(item.id);
                                                            setIsFocus(false);
                                                        }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <FontAwesome5 name="money-bill-alt" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                    {/* <Feather name="map-pin" size={ Dims.iconsize - 4 } color={ Colors.whiteColor } /> */}
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Zône de production | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <Dropdown
                                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                        containerStyle={{}}
                                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        data={zones}
                                                        search
                                                        maxHeight={200}
                                                        labelField="value"
                                                        valueField="id"
                                                        placeholder={'Séléctionner une zône'}
                                                        searchPlaceholder="Recherche ..."
                                                        onChange={item => {
                                                            setzone(item.id);
                                                        }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <MaterialCommunityIcons name="arrow-expand" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Province <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>

                                                    <Dropdown
                                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        data={provinces}
                                                        search
                                                        maxHeight={200}
                                                        labelField="province"
                                                        valueField="id"
                                                        placeholder={'Séléctionner la province'}
                                                        searchPlaceholder="Recherche ..."
                                                        onChange={item => {
                                                            setprovince(ON ? (item && item['id']) : (item && item['realid']));
                                                            loadTerritoires({ idprovince: ON ? (item && item['id']) : (item && item['realid']) })
                                                        }}
                                                    />

                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <Feather name="briefcase" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Territoire <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <Dropdown
                                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                        containerStyle={{}}
                                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        data={territoires}
                                                        search
                                                        maxHeight={200}
                                                        labelField="territoire"
                                                        valueField="id"
                                                        placeholder={'Séléctionner un territoire'}
                                                        searchPlaceholder="Recherche ..."
                                                        // onFocus={() => setIsFocus(true)}
                                                        // onBlur={() => setIsFocus(false)}
                                                        onChange={item => {
                                                            loadVillages({ idterritoire: ON ? (item && item['id']) : (item && item['realid']) })
                                                            setterritoire(ON ? (item && item['id']) : (item && item['realid']))
                                                        }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <MaterialCommunityIcons name="arrow-expand" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 15 }}>
                                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Village <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                            <View style={inputGroup.container}>
                                                <View style={inputGroup.inputcontainer}>
                                                    <Dropdown
                                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                        containerStyle={{}}
                                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                        data={villages}
                                                        search
                                                        maxHeight={200}
                                                        labelField="village"
                                                        valueField="id"
                                                        placeholder={'Séléctionner un village'}
                                                        searchPlaceholder="Recherche ..."
                                                        // onFocus={() => setIsFocus(true)}
                                                        // onBlur={() => setIsFocus(false)}
                                                        onChange={item => {
                                                            // setpos({ latitude: item['latitude'], longitude: item['longitude'] })
                                                            setvillage(ON ? (item && item['id']) : (item && item['realid']))
                                                        }}
                                                    />
                                                </View>
                                                <View style={[inputGroup.iconcontainer, {}]}>
                                                    <MaterialCommunityIcons name="arrow-expand" size={Dims.iconsize - 4} color={Colors.primaryColor} />
                                                </View>
                                            </View>
                                        </View>
                                        {/* -------------------------- */}
                                    </View>
                                )
                            }
                            {/* ============================================================================== */}
                            {(currentPosition === 0 || currentPosition === 1) &&
                                (
                                    <View style={{ width: "100%", height: 65, flexDirection: "row", marginTop: 25, justifyContent: "space-between" }}>
                                        <TouchableHighlight

                                            disabled={isloading}
                                            onPress={() => {
                                                setcurrentPosition(currentPosition === 2 ? 1 : 0)
                                            }}
                                            underlayColor={Colors.pillColor}
                                            style={{ width: "35%", backgroundColor: Colors.pillColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                        >
                                            {isFocusg
                                                ? <Loader color={Colors.whiteColor} />
                                                :
                                                (
                                                    <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                                        <Ionicons name='arrow-back-circle' color={Colors.primaryColor} style={{ paddingHorizontal: 10 }} size={Dims.iconsize} />
                                                        <Text style={{ color: Colors.primaryColor, fontFamily: "mons-b" }}>Retour</Text>
                                                    </View>
                                                )
                                            }
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            disabled={isloading}
                                            onPress={() => {
                                                setcurrentPosition(currentPosition === 0 ? 1 : 2)
                                            }}
                                            underlayColor={Colors.primaryColor}
                                            style={{ width: "60%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                        >
                                            {isFocusg
                                                ? <Loader color={Colors.whiteColor} />
                                                :
                                                (
                                                    <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Suivant</Text>
                                                        <Ionicons name='arrow-forward-circle' color={Colors.whiteColor} style={{ paddingHorizontal: 10 }} size={Dims.iconsize} />
                                                    </View>
                                                )
                                            }
                                        </TouchableHighlight>
                                    </View>
                                )
                            }
                            {currentPosition === 2 &&
                                (
                                    <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                        <TouchableHighlight
                                            disabled={isloading}
                                            onPress={onSubmit}
                                            underlayColor={Colors.primaryColor}
                                            style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                        >
                                            {isFocusg
                                                ? <Loader color={Colors.whiteColor} />
                                                : <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Enregistrer</Text>
                                            }
                                        </TouchableHighlight>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
            <Footer />
        </>
    )
}