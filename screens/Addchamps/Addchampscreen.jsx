import * as React from 'react';
import { RefreshControl, View, Text, ScrollView, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { inputGroup, map } from '../../assets/styles/Styles';
import { Dropdown } from 'react-native-element-dropdown';
import { appname, appslogan, umergencyphonenumber } from '../../assets/configs/configs';
import { onRunExternalRQST, onRunInsertQRY, onRunRetrieveQRY } from '../../services/communications';
import Toast from 'react-native-toast-message';
import { Loader } from '../../components/Loader/comp.loader';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import DialogBox from 'react-native-dialogbox';
import * as Location from 'expo-location';
import MultiSelect from 'react-native-multiple-select';
import NetInfos from '@react-native-community/netinfo';
import { BottomSheet } from '../../components/Bottomsheet/Bottomsheet.com';

export const Addchampsscreen = ({ navigation, route }) => {
    
    const [ON, setisON] = React.useState(true);
    const user = global && global['user'];
    const item = route && route['params'] && route['params']['item'];
    const [isloading, setisloading] = React.useState(false);
    const [isFocusg, setIsFocusg] = React.useState(false);
    const [hosp ,sethosp] = React.useState("");
    const [isVisible, setisVisible] = React.useState(false);
    // item && item['id'] ? ON ? item['realid'] : item["id"] : ""
    const [gender, setgender] = React.useState( ON ? item && item['id'] : item && item['realid'] );
    const ref = React.useRef();
    const refx = React.useRef();
    const [coordss, setcoords] = React.useState({});
    const [pos, setpos] = React.useState({});
    const [selectedItems, setselectedItems] = React.useState([]);

    const [culs, setculs] = React.useState([]);
    const [agrs, setagrs] = React.useState([]);
    const [dims, setdims] = React.useState("");
    const [nomchamps, setchamps] = React.useState("");
    const [zones , setzones] = React.useState([]);

    const [provinces, setprovinces] = React.useState([]);
    const [territoires, setterritoires] = React.useState([]);
    const [villages, setvillages] = React.useState([]);

    const [province, setprovince] = React.useState("");
    const [territoire, setterritoire] = React.useState("");
    const [village, setvillage] = React.useState("");

    const loadTerritoires = async ({ idprovince }) => {
        setisloading(true);
        if(ON) 
            onRunExternalRQST({
                method: "GET",
                url: `/territoires/liste/by/${idprovince}`
            }, (err, done) => {
                if(done && done['status'] === 200){
                    setisloading(false);
                    setterritoires(done && done['data'] && done['data']['liste'])
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Echec chargement des informations sur les territoires !',
                    });
                    setisloading(false);
                }
            })
        else{
            // alert(1)
            await onRunRetrieveQRY({ table: "__tbl_backup_territoires", limit: 2000, clause: ` where idprovince = '${idprovince}'` }, (er, done) => {
                if(done && done['length'] > 0){
                    setisloading(false)
                    setterritoires(done)
                }else setisloading(false)
            });
        }
    };

    const loadProvinces = async () => {
        setisloading(true);
        if(ON) 
            onRunExternalRQST({
                method: "GET",
                url: `/provinces/liste`
            }, (err, done) => {
                if(done && done['status'] === 200){
                    setisloading(false);
                    setprovinces(done && done['data']['liste']);
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Echec chargement des informations sur les provinces !',
                    });
                    setisloading(false);
                }
            })
        else
            await onRunRetrieveQRY({ table: "__tbl_backup_provinces", limit: 2000 }, (er, done) => {
                if(done && done['length'] > 0){
                    setprovinces(done)
                    setisloading(false)
                }else setisloading(false)
            });
    };

    const loadVillages = async ({ idterritoire }) => {
        setisloading(true);
        if(ON)
            onRunExternalRQST({
                method: "GET",
                url: `/villages/liste/byterritory/${idterritoire}`
            }, (err, done) => {
                if(done && done['status'] === 200){
                    setisloading(false);
                    setvillages(done && done['data']['liste']);
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Echec chargement des informations sur les provinces !',
                    });
                    setisloading(false);
                }
            })
        else
            await onRunRetrieveQRY({ table: "__tbl_backup_villages", clause: ` where territoire = '${idterritoire}'`, limit: 2000 }, (er, done) => {
                if(done && done['length'] > 0){
                    setvillages(done)
                    setisloading(false)
                }else setisloading(false)
            });
    };

    const loadCultures = async () => {
        setisloading(true);
        if(ON)
            onRunExternalRQST({
                method: "GET",
                url: `/cultures/liste`
            }, (err, done) => {
                if(done && done['status'] === 200){
                    setisloading(false);
                    setculs(done && done['data'] && done['data']['liste'])
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Echec chargement des informations sur les cultures !',
                    });
                    setisloading(false);
                }
            })
        else
            await onRunRetrieveQRY({ table: "__tbl_backup_cultures", limit: 2000 }, (er, done) => {
                if(done && done['length'] > 0){
                    setculs(done)
                    setisloading(false)
                }else setisloading(false)
            });
    };

    const loadAgriculteurs = async () => {
        setisloading(true);
        if(ON)
            onRunExternalRQST({
                method: "GET",
                url: `/agriculteurs/liste`
            }, (err, done) => {
                if(done && done['status'] === 200){
                    const d = done && done['data'] && done['data']['liste'];
                    const tmp = [];
                    d.forEach((v, i) => {
                        tmp.push({
                            id: v && v['id'],
                            nom: `${v && v['nom']} ${v && v['postnom']} | ${v && v['phone']}`
                        })
                    });
                    setisloading(false);
                    setagrs(tmp);
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Echec chargement des informations sur les agriculteurs !',
                    });
                    setisloading(false);
                }
            })
        else
            await onRunRetrieveQRY({ table: "__tbl_backup_agriculteurs", limit: 2000 }, (er, done) => {
                if(done && done['length'] > 0){
                    const d = done;
                    const tmp = [];
                    d.forEach((v, i) => {
                        tmp.push({
                            id: v && v['realid'],
                            nom: `${v && v['nom']} ${v && v['postnom']} | ${v && v['phone']}`
                        })
                    });
                    setisloading(false);
                    setagrs(tmp);
                }else setisloading(false)
            });
    };

    const onConfirm = () => {
        if(isloading){
            setisloading(false)
            setshw(false);
        }else{
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    ref.current.confirm({
                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Paramètres</Text>,
                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} N'arrive pas à avoir accès à votre position; Nous ne pouvons procéder avec votre requête sans avoir accès à votre position géographique</Text>],
                        ok: {
                            text: 'Authoriser',
                            style: {
                                color: Colors.primaryColor,
                                fontFamily: 'mons',
                                fontSize: Dims.subtitletextsize
                            },
                            callback: () => onConfirm()
                        },
                        cancel: {
                            text: 'Annuler',
                            style: {
                                color: Colors.darkColor,
                                fontFamily: "mons-e",
                                fontSize: Dims.subtitletextsize
                            }
                        },
                    })
                  return;
                }else{
                    let { coords } = await Location.getCurrentPositionAsync({});
                    const { speed, altitude, longitude, latitude } = coords;
                }
            })();
        }
    };

    const onSetCurrentPosition = async () => {
        setisVisible(!isVisible);
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                refx.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Paramètres</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} n'arrive pas à avoir accès à votre position; </Text>],
                    ok: {
                        text: 'Authoriser',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: () => onSetCurrentPosition()
                    },
                    cancel: {
                        text: 'Annuler',
                        style: {
                            color: Colors.darkColor,
                            fontFamily: "mons-e"
                        }
                    },
                })
              return;
            }else{
                refx.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Ajout de ma position</Text>,
                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vous êtes sur le point de mettre à jour votre position actuelle </Text>],
                    ok: {
                        text: 'Continuer',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: async () => {    
                            let { coords } = await Location.getCurrentPositionAsync({});
                            const { speed, altitude, longitude, latitude } = coords;
                            // console.log(" My pos => ", coords);
                            setisloading(true);
                            setcoords(coords);
                            setisloading(false);
                        }
                    },
                    cancel: {
                        text: 'Annuler',
                        style: {
                            color: Colors.darkColor,
                            fontFamily: "mons-e"
                        }
                    },
                })
            }
        })()
    };

    const onSelectedItemsChange = selectedItems => {
        setselectedItems(selectedItems);
        // console.log(" Selcted items are => ", selectedItems);
    };

    const onReset = async () => {
        setchamps("");
        setpos({});
        setdims("");
        setculs("");
    };

    const onSubmit = async () => {
            if(dims.length > 0){
                if(selectedItems.length > 0){
                    if(gender !== "" || gender.length > 0){
                        // Object.keys(pos).length > 0
                        if(1){
                        setisloading(true);
                        // {
                        //     champs: 'testchamp',
                        //     idambassadeur: 1092,
                        //     dimensions: '200',
                        //     latitude: '-0.95587',
                        //     longitude: '28.81403',
                        //     idzoneproduction: '',
                        //     idculture: [ 123 ]
                        // }
                        const data = {
                            champs: nomchamps,
                            idagriculteurs: gender,
                            idambassadeur: user && user['realid'],
                            dimensions: dims,
                            latitude: pos && pos['latitude'],
                            longitude: pos && pos['longitude'],
                            altitude: pos && pos['altitude'] ? pos['altitude'] : 0,
                            idzoneproduction: hosp,
                            idculture: selectedItems
                        };
                        console.log(" Data is =>  ", data);
                        if(ON){
                            onRunExternalRQST({
                                method: "POST",
                                data: data,
                                url: `/champs/champ/add`
                            }, (er, done) => {
                                console.log(" Message from server => ", done);
                                if(done && done['status'] === 200){
                                    setisloading(false);
                                    onReset();
                                    ref.current.pop({
                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Champs ajouté avec succès !</Text>,
                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >La requête vient d'être executée avec succès le champs a été ajouter avec succès</Text>],
                                        btns: [
                                            {
                                                text: 'Ajouter un nouveau champs',
                                                style: {
                                                    color: Colors.primaryColor,
                                                    fontFamily: 'mons',
                                                    fontSize: Dims.subtitletextsize
                                                },
                                                callback: () => {  }
                                            },
                                            {
                                                text: 'Visualiser le champs ajouter',
                                                style: {
                                                    color: Colors.primaryColor,
                                                    fontFamily: 'mons',
                                                    fontSize: Dims.subtitletextsize
    
                                                },
                                                callback: () => { return navigation.replace("champs", { item: done['data'] })}
                                            },
                                            {
                                                text: 'Modifier cet enregistrement',
                                                style: {
                                                    color: Colors.primaryColor,
                                                    fontFamily: 'mons',
                                                    fontSize: Dims.subtitletextsize
    
                                                },
                                                callback: () => { return navigation.replace("edit-champs", { item: done['data'], id: item && item['id'] ? item['id'] : gender }) }
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
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Réussite',
                                        text2: 'Le champs a été ajouter avec succès !',
                                    });
                                }else{
                                    setisloading(false);
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Une erreur vient de se produire !'
                                    });
                                }
                            })
                        }else{
                            onRunInsertQRY({
                                columns: `'champs','idagriculteurs','idambassadeur','dimensions','latitude','longitude','altitude','idzoneproduction','idculture','status','createdon','issynched'`,
                                dot: '?,?,?,?,?,?,?,?,?,?,?,?',
                                options: {},
                                table: '__tbl_champs',
                                values: [`${data.champs}`, `${data.idagriculteurs}`,`${data.idambassadeur}`,`${data.dimensions}`, `${data.latitude}`,`${data.longitude}`, `${0}`,`${data.idzoneproduction}`,`${data.idculture.toString()}`,1, `${new Date().toLocaleString()}`, 0]
                            }, (err, done) => {
                                if(done){
                                    setisloading(false);
                                    onReset();
                                    ref.current.pop({
                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Champs ajouté avec succès !</Text>,
                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >La requête vient d'être executée avec succès le champs a été ajouter avec succès</Text>],
                                        btns: [
                                            {
                                                text: 'Ajouter un nouveau champs',
                                                style: {
                                                    color: Colors.primaryColor,
                                                    fontFamily: 'mons',
                                                    fontSize: Dims.subtitletextsize
                                                },
                                                callback: () => {  }
                                            },
                                            {
                                                text: 'Visualiser le champs ajouter',
                                                style: {
                                                    color: Colors.primaryColor,
                                                    fontFamily: 'mons',
                                                    fontSize: Dims.subtitletextsize
    
                                                },
                                                callback: () => { return navigation.replace("champs", { item: done })}
                                            },
                                            {
                                                text: 'Modifier cet enregistrement',
                                                style: {
                                                    color: Colors.primaryColor,
                                                    fontFamily: 'mons',
                                                    fontSize: Dims.subtitletextsize
    
                                                },
                                                callback: () => { return navigation.replace("edit-champs", { item: done, id: item && item['id'] ? item['id'] : gender }) }
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
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Réussite',
                                        text2: 'Le champs a été ajouter avec succès !',
                                    });
                                }else{
                                    setisloading(false);
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Une erreur de sauvegarde vient de se produire !'
                                    });
                                }
                            })
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Séléctionner d\'abord votre position avant de continuer !',
                        });
                    }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Séléctionner les cultures avant de continuer !',
                    });
                }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Vous devez séléctionner les culteures !'
                    });
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Entrer les dimansions du champs !',
                });
            }
    };

    const __ = () => {
        loadAgriculteurs();
        loadProvinces();
        loadCultures();
    };

    React.useEffect(() => {
        __();
        NetInfos.addEventListener(on => {
            if(on.isConnected) setisON(true) 
            else setisON(false)
        })
    }, []);

    return(
        <>
            <Title 
                navigation={navigation}
                title={"Enregistrement d'un champs"} 
                subtitle={"Formulaire ajout champs | Pour un agriculteur"} 
            />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingTop: Dims.borderradius }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: "10%" }}
                    refreshControl={
                        <RefreshControl
                            colors={[ Colors.primaryColor ]}
                            refreshing={ isloading }
                            onRefresh={ __ }
                        />
                    }
                >
                    <View style={{width: "90%", alignSelf: "center", paddingVertical: 10}}>
                        <Text style={{ paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.titletextsize }}>Ajout d'un champs</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Formulaire d'ajout d'un nouveaux champs et le lié à un cultivateur | remplissez les champs pour pouvoir l'ajouter dans le système </Text>
                    </View>
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <Divider />
                    </View>
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor,  marginTop: 10, paddingBottom: 100 }}>
                        <View style={{width: "90%", alignSelf: "center", marginTop: 0 }}>
                            {pos && Object.keys(pos).length > 0 && 
                                (
                                    <View style={{ flexDirection: "row", marginBottom: 20 }}>
                                        <View style={{ width: "50%", alignContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "mons-e" }}>Latitude</Text>
                                            <Text style={{ fontFamily: "mons" }}>{pos && pos['latitude'] ? pos['latitude'] : "---"}</Text>
                                        </View>
                                        <View style={{ width: "50%", alignContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "mons-e" }}>Longitude</Text>
                                            <Text style={{ fontFamily: "mons" }}>{pos && pos['longitude'] ? pos['longitude'] : "---"}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 20}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse du champs ou nom | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput onChangeText={ t => setchamps(t) } placeholder='adresse du champs ou nom' style={{ color: Colors.primaryColor, backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialIcons name="leak-add" size={ Dims.iconsize - 4 } color={Colors.primaryColor} />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Proprietaire agriculteur <Text style={{color: Colors.dangerColor}}>*</Text></Text>
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
                                                selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                data={agrs}
                                                search
                                                maxHeight={ 200 }
                                                labelField="nom"
                                                valueField="id"
                                                placeholder={!isFocusg ? 'Séléctionner l\'agriculteur' : '...'}
                                                searchPlaceholder="Recherche ..."
                                                onChange={item => {
                                                    setgender(item.id);
                                                }}
                                            />
                                    }
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <Feather name="user" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Dimensions <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={[ inputGroup.inputcontainer, { flexDirection: "row", alignContent: "center", alignItems: "center" }]}>
                                        <TextInput 
                                            keyboardType='numeric'
                                            onChangeText={t => setdims(t)}
                                            placeholder='Ex: 120' 
                                            style={{ color: Colors.primaryColor, backgroundColor: Colors.pillColor, height: "100%", width: "65%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                        />
                                        <View style={{ backgroundColor: Colors.pillColor, width: "35%", height: "100%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.subtitletextsize - 2, color: Colors.primaryColor }}>Hectares ( ha )</Text>
                                        </View>
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, {  }]}>
                                        <FontAwesome name="area-chart" size={ Dims.iconsize - 4 } color={Colors.primaryColor} />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Province <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>

                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={provinces}
                                            search
                                            maxHeight={ 200 }
                                            labelField="province"
                                            valueField="id"
                                            placeholder={'Séléctionner la province'}
                                            searchPlaceholder="Recherche ..."
                                            onChange={item => {
                                                setprovince(ON ? ( item && item['id'] ) : ( item && item['realid'] ));
                                                loadTerritoires({ idprovince: ON ? ( item && item['id'] ) : ( item && item['realid'] ) })
                                            }}
                                        />
                                    
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <Feather name="briefcase" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Territoire <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={territoires}
                                            search
                                            maxHeight={ 200 }
                                            labelField="territoire"
                                            valueField="id"
                                            placeholder={'Séléctionner un territoire'}
                                            searchPlaceholder="Recherche ..."
                                            // onFocus={() => setIsFocus(true)}
                                            // onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                loadVillages({ idterritoire: ON ? ( item && item['id'] ) : ( item && item['realid'] ) })
                                                setterritoire(ON ? ( item && item['id'] ) : ( item && item['realid'] ))
                                            }}
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialCommunityIcons name="arrow-expand" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Village <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={villages}
                                            search
                                            maxHeight={ 200 }
                                            labelField="village"
                                            valueField="id"
                                            placeholder={'Séléctionner un village'}
                                            searchPlaceholder="Recherche ..."
                                            // onFocus={() => setIsFocus(true)}
                                            // onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setpos({latitude: item['latitude'], longitude: item['longitude']})
                                                setvillage(ON ? ( item && item['id'] ) : ( item && item['realid'] ))
                                            }}
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialCommunityIcons name="arrow-expand" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            {/* -------------------------- */}
                            {/* <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Zone de production | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                            placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                            containerStyle={{}}
                                            selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                            inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                            data={zones}
                                            search
                                            maxHeight={ 200 }
                                            labelField="zoneproduction"
                                            valueField="id"
                                            placeholder={!isFocus ? 'Séléctionner une zone' : '...'}
                                            searchPlaceholder="Recherche ..."
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                sethosp(item.id);
                                                setIsFocus(false);
                                            }}
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialCommunityIcons name="arrow-expand" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View> */}
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Cultures <Text style={{color: Colors.dangerColor}}>*</Text></Text>

                                <View style={{ width: "100%", minHeight: 65, flexDirection: "column", marginTop: 0, position: "absolute", top: 25, zIndex: 28972 }}>
                                    <MultiSelect
                                        hideTags
                                        items={culs}
                                        uniqueKey="id"
                                        displayKey="cultures"
                                        containerStyle={{ backgroundColor: "lime" }}
                                        ref={ ref }
                                        styleListContainer={{ backgroundColor: Colors.whiteColor, paddingVertical: 0 }}
                                        styleMainWrapper={{ minHeight: 65, paddingTop: 0, paddingHorizontal: 0, elevation: Dims.elevation }}
                                        onSelectedItemsChange={ onSelectedItemsChange }
                                        selectedItems={selectedItems}
                                        selectText="Séléctionner les cultures"
                                        searchInputPlaceholderText="Rechercher d'une culture ..."
                                        onChangeInput={ (text) => {}}
                                        altFontFamily="mons"
                                        tagRemoveIconColor="#CCC"
                                        tagBorderColor="#CCC"
                                        tagTextColor="#CCC"
                                        // removeSelected
                                        selectedItemTextColor={Colors.primaryColor}
                                        selectedItemIconColor={Colors.primaryColor}
                                        itemTextColor={Colors.darkColor}
                                        styleItemsContainer={{ backgroundColor: "red" }}
                                        searchInputStyle={{ color: Colors.darkColor, height: 45, backgroundColor: Colors.whiteColor, paddingHorizontal: 10 }}
                                        submitButtonColor={Colors.primaryColor}
                                        // styleRowList={{ backgroundColor: "lime" }}
                                        styleDropdownMenuSubsection={{ paddingVertical: 0, marginTop: 0 }}
                                        submitButtonText="Ajouter les séléctions"
                                        fontFamily='mons'
                                        noItemsText='Aucune information pour le moment'
                                        styleRowList={{ 
                                            paddingVertical: 4,
                                            marginTop: 2,
                                            height: Dims.inputTextHeight,
                                            alignContent: "center",
                                            justifyContent: "center",
                                            borderRadius: Dims.borderradius,
                                            backgroundColor: Colors.pillColor
                                        }}
                                    />
                                </View>
                            </View>
                            {/* -------------------------- */}
      
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    onPress={onSubmit}
                                    underlayColor={ Colors.primaryColor }
                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    {isloading 
                                    ?
                                        <Loader />
                                    :
                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Enregistrer</Text>    
                                    }
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    <Footer/>
                </ScrollView>
            </View>
            <BottomSheet 
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
                        sText: "Il semble que vous n'êtes pas connectez sur internet, vos informations peuvent être enregistrées en local; vous pouvew faire la synchronisation plus tard" 
                    }
                }
            />
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}
