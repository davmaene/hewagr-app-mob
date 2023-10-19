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
import { onRunExternalRQST } from '../../services/communications';
import Toast from 'react-native-toast-message';
import { Loader } from '../../components/Loader/comp.loader';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import DialogBox from 'react-native-dialogbox';
import * as Location from 'expo-location';

export const Addzonedeproductionscreen = ({ navigation, route }) => {

    const user = global && global['user'];
    const item = route && route['params'] && route['params']['item'];
    const [isloading, setisloading] = React.useState(false);
    const [isVisible, setisVisible] = React.useState(false);
    const [isVisibles, setisVisibles] = React.useState(false);
    const ref = React.useRef();
    const refx = React.useRef();
    const [choice, setchoice] = React.useState(false);
    const [coordss, setcoords] = React.useState({});
    const [pos, setpos] = React.useState({});

    const [provinces, setprovinces] = React.useState([]);
    const [territoires, setterritoires] = React.useState([]);
    const [villages, setvillages] = React.useState([]);

    const [province, setprovince] = React.useState("");
    const [territoire, setterritoire] = React.useState("");
    const [village, setvillage] = React.useState("");
    const [zone , setzone] = React.useState("");

    const loadTerritoires = async ({ idprovince }) => {
        setisloading(true);
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
    };

    const loadProvinces = async () => {
        setisloading(true);
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
    };

    const loadVillages = async ({ idterritoire }) => {
        setisloading(true);
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

    const onSetCurrentPositionWithoutMap = async () => {
        
        ref.current.confirm({
            title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Position et Localisation</Text>,
            content: [
                <FontAwesome5 name="map-marker-alt" size={Dims.iconsize + 10} color={Colors.primaryColor} />,
                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} ><Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>{appname}</Text> collecte les données de <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>localisation</Text>  pour permettre l'enregistrement de <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>nouveaux champs de plantation </Text>et le suivi de l'activité physique même lorsque l'application est fermée ou inutilisée. Ces données sont necéssaire pour les fonctionalités de l'application <Text style={{ fontFamily: "mons", color: Colors.primaryColor }}>{appname}</Text></Text>
            ],
            ok: {
                text: 'Accepter',
                style: {
                    color: Colors.primaryColor,
                    fontFamily: 'mons'
                },
                callback: () => {    
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
                            setisloading(true)
                            Location.getCurrentPositionAsync()
                            .then(({ coords }) => {
                                setisloading(false);
                                setcoords(coords);
                                setpos(coords);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Réussite',
                                    text2: 'Coordonnées captées avec succès !',
                                });
                                console.log(" Done message is => ", coords)
                            })
                            .catch(err => {
                                setisloading(false);
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur',
                                    text2: 'Une erreur vient de se produire lors de capture de la position !',
                                });
                                console.log(" Error message =>", err);
                            })
                        }
                    })()
                }
            },
            cancel: {
                text: 'Refuser',
                style: {
                    color: Colors.darkColor,
                    fontFamily: "mons-e"
                }
            },
        })
    };

    const onSubmit = async () => {

        if(zone.length > 0){
            if(province.length > 0 || province !== ""){
                if(territoire.length > 0 || territoire !== ""){
                    // Object.keys(pos).length > 0
                    if(1){
                        setisloading(true);
                        onRunExternalRQST({
                            method: "POST",
                            data: {
                                idambassadeur: user && user['realid'],
                                idprovince: province,
                                idterritoite: territoire,
                                zone,
                                idvillage: village,
                                coords: pos
                            },
                            url: `/zones/zone/add/withcoords`
                        }, (er, done) => {
                            console.log(" Data form server is => ", done);
                            if(done && done['status'] === 200){
                                setisloading(false);
                                onReset();
                                ref.current.pop({
                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Zône ajouté avec succès !</Text>,
                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >La requête vient d'être executée avec succès la zône de production a été ajouté avec succès</Text>],
                                    btns: [
                                        {
                                            text: 'Ajouter un nouveau champs',
                                            style: {
                                                color: Colors.primaryColor,
                                                fontFamily: 'mons',
                                                fontSize: Dims.subtitletextsize
                                            },
                                            callback: () => { return navigation.navigate("addchamps", { item: done['data'] }) }
                                        },
                                        {
                                            text: 'Ajouter une nouvelle zône de production',
                                            style: {
                                                color: Colors.primaryColor,
                                                fontFamily: 'mons',
                                                fontSize: Dims.subtitletextsize

                                            },
                                            callback: () => { return navigation.replace("addzone", { item: done['data'] })}
                                        },
                                        // {
                                        //     text: 'Modifier cet enregistrement',
                                        //     style: {
                                        //         color: Colors.primaryColor,
                                        //         fontFamily: 'mons',
                                        //         fontSize: Dims.subtitletextsize

                                        //     },
                                        //     callback: () => { return navigation.replace("edit-champs", { item: done['data'] }) }
                                        // },
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
                        text2: 'Séléctionner un territoire !',
                    });
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Séléctionner une province avant de continuer !'
                });
            }
        }else{
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Entrer le nom de la zône de production !',
            });
        }
    };

    const __ = async () => {
        // loadTerritoires();
        loadProvinces();
        // loadVillages();
    };

    React.useEffect(() => {
        __()
    }, []);

    return(
        <>
            <Title 
                navigation={navigation}
                title={"Ajout d'un champs"} 
                subtitle={"Formulaire ajout champs | Pour un agriculteur"} 
            />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingTop: Dims.borderradius }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: "50%" }}
                    refreshControl={
                        <RefreshControl
                            colors={[ Colors.primaryColor ]}
                            refreshing={ isloading }
                            onRefresh={ __ }
                        />
                    }
                >
                    <View style={{width: "90%", alignSelf: "center", paddingVertical: 10}}>
                        <Text style={{ paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Zône de production</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Formulaire d'ajout d'une nouvelle zône de production et la lier à un village | remplissez les champs pour pouvoir l'ajouter dans le système </Text>
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
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 0}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nom zône <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput onChangeText={ t => setzone(t) } placeholder='nom de la zône' style={{ color: Colors.primaryColor, backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialIcons name="leak-add" size={ Dims.iconsize - 4 } color={Colors.primaryColor} />
                                    </View>
                                </View>
                            </View>
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Province <Text style={{color: Colors.dangerColor}}>*</Text></Text>
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
                                                data={provinces}
                                                search
                                                maxHeight={ 200 }
                                                labelField="province"
                                                valueField="id"
                                                placeholder={'Séléctionner la province'}
                                                searchPlaceholder="Recherche ..."
                                                onChange={item => {
                                                    setprovince(item && item['id']);
                                                    loadTerritoires({ idprovince: item && item['id'] })
                                                }}
                                            />
                                    }
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
                                                loadVillages({ idterritoire: item && item['id'] })
                                                setterritoire(item && item['id'])
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
                                                setvillage(item && item['id'])
                                            }}
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialCommunityIcons name="arrow-expand" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            {/* <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    onPress={() => {
                                        setchoice(!choice)
                                        // setisVisible(!isVisible);
                                        // onSetCurrentPosition();
                                    }}
                                    underlayColor={ Colors.primaryColor }
                                    style={{ width: "100%", backgroundColor: choice ? Colors.inactiveColor : Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    <>
                                        <MaterialCommunityIcons name="map-marker-plus-outline" size={ Dims.iconsize - 1 } color={ Colors.whiteColor } />
                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Capter les coordonnées géographiques</Text>
                                    </>
                                </TouchableHighlight>
                            </View> */}
                            {choice && 
                                (
                                    <View style={{ width: "100%", marginBottom: 20 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                                            <View style={{ width: "48%" }}>
                                                <TouchableHighlight 
                                                    onPress={() => {
                                                        setisVisibles(!isVisibles);
                                                        // onSetCurrentPosition();
                                                    }}
                                                    underlayColor={ Colors.primaryColor }
                                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                                >
                                                    <>
                                                        <MaterialCommunityIcons name="file-edit" size={ Dims.iconsize - 1 } color={ Colors.whiteColor } />
                                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Manuelle</Text>
                                                    </>
                                                </TouchableHighlight>
                                            </View>

                                            <View style={{ width: "48%" }}>
                                                <TouchableHighlight 
                                                    onPress={() => {
                                                        onSetCurrentPositionWithoutMap();
                                                    }}
                                                    underlayColor={ Colors.primaryColor }
                                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                                >
                                                    <>
                                                        <MaterialCommunityIcons name="map-marker-plus-outline" size={ Dims.iconsize - 1 } color={ Colors.whiteColor } />
                                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Auto.</Text>
                                                    </>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
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
            <View style={{ padding: 0, alignSelf: "center", overflow: "hidden", borderTopStartRadius: Dims.borderradius, borderTopEndRadius: Dims.borderradius, backgroundColor: Colors.whiteColor }}>
                <Modal
                    style={{ position: "absolute", bottom: -20, height: 500, overflow: "hidden", backgroundColor: Colors.whiteColor, alignSelf: "center", borderTopStartRadius: Dims.borderradius - 6, borderTopEndRadius: Dims.borderradius - 6 }}
                    isVisible={isVisibles || isVisible}
                    onBackButtonPress={() => { setisVisibles(false); setisVisible(false); }}
                    onBackdropPress={() => { setisVisibles(false); setisVisible(false); }}
                    onDismiss={() => { 
                            setisVisible(false);
                            setisVisibles(false); 
                            setchoice(false); 
                            setisloading(false); 
                        } 
                    }
                >
                    {isVisibles && 
                        (
                            <View style={[ map, { alignSelf: "center", width: "100%" } ]}>
                                <View style={{ position: "absolute", width: "100%", height: 75, backgroundColor: Colors.pillColor, zIndex: 2992782, top: 0, elevation: 28 }}>
                                    <View style={{ flexDirection: "column", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center", height: 75 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.bigtitletextsize - 5 }}>Saisie manuelle</Text>
                                        <Text style={{ fontFamily: "mons-e" }}>Votre position actuelle sera prise manuellement</Text>
                                    </View>
                                </View>
                                <View style={{ width: Dims.width }}>
                                    <ScrollView 
                                        contentContainerStyle={{ paddingBottom: "100%", backgroundColor: Colors.whiteColor, marginTop: 60 }}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={{width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 0}}>
                                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Latitude <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                                <View style={ inputGroup.container }>
                                                    <View style={ inputGroup.inputcontainer }>
                                                        <TextInput 
                                                            keyboardType='numeric'
                                                            onChangeText={(t) => {
                                                                setpos({...pos, latitude: t})
                                                            }}
                                                            placeholder='Latitude' 
                                                            style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                                        />
                                                    </View>
                                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                                        <FontAwesome name="map-marker" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Longitude <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                                <View style={ inputGroup.container }>
                                                    <View style={ inputGroup.inputcontainer }>
                                                        <TextInput 
                                                            keyboardType='numeric'
                                                            onChangeText={(t) => {
                                                                setpos({...pos, longitude: t})
                                                            }}
                                                            placeholder='Longitude' 
                                                            style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                                        />
                                                    </View>
                                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                                        <FontAwesome name="map-marker" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Altitude | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                                <View style={ inputGroup.container }>
                                                    <View style={ inputGroup.inputcontainer }>
                                                        <TextInput 
                                                            onChangeText={(t) => {
                                                                setpos({...pos, altitude: t})
                                                            }}
                                                            keyboardType='numeric'
                                                            placeholder='Altitude' 
                                                            style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                                        />
                                                    </View>
                                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                                        <FontAwesome name="map" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                                <TouchableHighlight 
                                                    onPress={() => {
                                                        if(Object.keys(pos).length > 0 && pos.hasOwnProperty("latitude") && pos.hasOwnProperty("longitude")) setisVisibles(!isVisibles);
                                                        else{
                                                            Toast.show({
                                                                type: 'error',
                                                                text1: 'Erreur',
                                                                text2: 'Entre la latitude et la longitude !',
                                                            });
                                                        }
                                                    }}
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
                                    </ScrollView>
                                </View>
                            </View>
                        )
                    }
                    {isVisible && 
                        (
                           <>
                                <View style={[ map, { alignSelf: "center" } ]}>
                                    <View style={{ position: "absolute", width: "100%", height: 75, backgroundColor: Colors.pillColor, zIndex: 2992782, top: 0, elevation: 28, paddingHorizontal: 30 }}>
                                        <View style={{ flexDirection: "column", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center", height: 75 }}>
                                            <Text style={{ fontFamily: "mons-b", fontSize: Dims.bigtitletextsize - 5 }}>Position actuelle</Text>
                                            <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Votre position actuelle sera prise comme référence !</Text>
                                        </View>
                                    </View>
                                    <MapView 
                                        // ref={refmap}
                                        region={
                                            {
                                                latitudeDelta: 0.02,
                                                longitudeDelta: 0.02,
                                                ... Object.keys(coordss).length > 0 ? coordss : {
                                                    latitude: parseFloat(-1.6734344),
                                                    longitude: parseFloat(29.2325225)
                                                }
                                            }
                                        }
                                        style={{ width: Dims.width, height: Dims.height }} 
                                    >
                                        {
                                            Object.keys(coordss).length > 0 && (
                                                <Marker
                                                    key={`${Math.random() * Math.random()}`}
                                                    coordinate={coordss}
                                                    title={"Vous"}
                                                    description={`Ceci est votre position actuelle !`}
                                                />
                                            )
                                        }
                                    </MapView>
                                    <View style={{ position: "absolute", width: "100%", height: "auto", zIndex: 2992782, bottom: 0 }}>
                                        <TouchableHighlight 
                                            style={{ flexDirection: "row", elevation: 28, borderRadius: Dims.borderradius, width: "90%", backgroundColor: Colors.primaryColor, alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center", height: 50, marginVertical: 15 }}
                                            underlayColor={Colors.primaryColor}
                                            onPress={() => {
                                                if(Object.keys(coordss).length > 0){
                                                    setisVisible(false);
                                                    setpos(coordss);
                                                    setchoice(false);
                                                }else{
                                                    onSetCurrentPosition();
                                                }
                                            }}
                                            disabled={isloading}
                                        >
                                            {
                                                isloading
                                                ?
                                                    <Loader/>
                                                :
                                                <>
                                                    <AntDesign name="checkcircleo" size={ Dims.iconsize } color={Colors.whiteColor} />
                                                    <Text style={{ paddingLeft: 10, fontFamily: "mons", color: Colors.whiteColor }}>Prendre ma position actuelle</Text>
                                                </>
                                            }
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                <DialogBox ref={refx} isOverlayClickClose={false} />
                           </> 
                        )
                    }
                </Modal>
            </View>
            <View style={{ padding: 0, alignSelf: "center", overflow: "hidden", borderTopStartRadius: Dims.borderradius, borderTopEndRadius: Dims.borderradius, backgroundColor: Colors.whiteColor }}>
            </View>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}
