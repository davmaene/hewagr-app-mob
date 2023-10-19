import * as React from 'react';
import { RefreshControl, View, Text, ScrollView, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
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
import MultiSelect from 'react-native-multiple-select';
import { convertStringIntoArray } from '../../assets/Helper/Helpers';

export const Editchampsscreen = ({ navigation, route }) => {

    const user = global && global['user'];
    const item = route && route['params'] && route['params']['item'];
    const agr = item && item['__tbl_agriculteur'];
    const [isloading, setisloading] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);
    const [isFocusg, setIsFocusg] = React.useState(false);
    const [hosp ,sethosp] = React.useState("");
    const [isVisible, setisVisible] = React.useState(false);
    const [isVisibles, setisVisibles] = React.useState(false);
    const [gender, setgender] = React.useState(agr && agr['id'] ? agr['id'] : "");
    const ref = React.useRef();
    const refx = React.useRef();
    const [choice, setchoice] = React.useState(false);
    const [coords, setcoords] = React.useState({});
    const [pos, setpos] = React.useState(item ? { latitude: item && item['latitude'], longitude: item && item['longitude'] } : {});
    const [selectedItems, setselectedItems] = React.useState(convertStringIntoArray({ chaine: item && item['idculture'] }));

    const [culs, setculs] = React.useState([]);
    const [agrs, setagrs] = React.useState([]);
    const [dims, setdims] = React.useState(item && item['dimensions']);
    const [nomchamps, setchamps] = React.useState(item && item['champs']);
    const [zones , setzones] = React.useState([]);

    const loadCultures = async () => {
        setisloading(true);
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
    };

    const loadAgriculteurs = async () => {
        setisloading(true);
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
    };

    const loadZones = async () => {
        setisloading(true);
        onRunExternalRQST({
            method: "GET",
            url: `/zones/liste`
        }, (err, done) => {
            if(done && done['status'] === 200){
                const d = done && done['data'] && done['data']['liste'];
                setisloading(false);
                setzones(d);
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Echec chargement des informations sur les zones de production !',
                });
                setisloading(false);
            }
        })
    };

    const resetForm = () => {

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
                    await onRunExternalRQST({
                        url: "/users/user/sendsos",
                        data: {
                            latitude, 
                            longitude, 
                            hospitalref: global['user']['hospitalref'], 
                            phone: global['user']['phone'], 
                            fsname: global['user']['fsname'], 
                            lsname: global['user']['lsname'], 
                            altitude, 
                            speed
                        },
                        // !latitude || !longitude || !phone || !altitude || !speed
                        method: "POST"
                    }, (err, don) => {
                        // console.log(don);
                        if(don){
                            setbefore(false);
                            switch (don['status']) {
                                case 200:
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Traitement en cours',
                                        text2: 'Votre requête est en cours de traitement !',
                                    });
                                    setisloading(!isloading);
                                    setmessage("Ne vous déplacez pas; les sécours arrivent incessement !")
                                    setshw(true)
                                    break;
                                case 401:
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Quelques paramètres manques dans la requête envoyée ',
                                    });
                                    break;
                                default:
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Erreur',
                                        text2: 'Une erreur est survenue lors de l\'activation du compte !',
                                    });
                                    break;
                            }
                        }else{
                            setbefore(false);
                            Toast.show({
                                type: 'error',
                                text1: 'Erreur',
                                text2: 'Une erreur est survenue lors de l\'activation du compte !',
                            });
                        }
                    })
                }
            })();
        }
    };

    const onSetCurrentPosition = () => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                ref.current.confirm({
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
                setisloading(true);
                ref.current.confirm({
                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Ajout de ma position</Text>,
                    content: [
                        <FontAwesome5 name="map-marker-alt" size={Dims.iconsize + 10} color={Colors.primaryColor} />,
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} cherche à accéder à votre position pour l'enregistrement d'un nouveau champs ! </Text>
                    ],
                    ok: {
                        text: 'Accepter',
                        style: {
                            color: Colors.primaryColor,
                            fontFamily: 'mons'
                        },
                        callback: async () => {    
                            // let { coords } = await Location.getCurrentPositionAsync({});
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
                    },
                    cancel: {
                        text: 'Refuser',
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

    const onSelectedItemsChange = selectedItems => {
        setselectedItems(selectedItems);
        // console.log(" Selcted items are => ", selectedItems);
    };

    const onReset = async () => {
        setchamps("");
        setpos({}),
        setdims("");
        setculs("");
    };

    const onSubmit = async () => {
       
        if(dims.toString().length > 0){
            if(selectedItems.length > 0){
                if(gender !== "" || gender.length > 0){
                    if(Object.keys(pos).length > 0){
                        setisloading(true);
                        onRunExternalRQST({
                            method: "PUT",
                            data: {
                                champs: nomchamps,
                                idagriculteurs: gender,
                                idambassadeur: user && user['id'],
                                dimensions: dims,
                                latitude: pos && pos['latitude'],
                                longitude: pos && pos['longitude'],
                                altitude: pos && pos['altitude'],
                                idzoneproduction: hosp,
                                idculture: selectedItems
                            },
                            url: `/champs/champ/${item && item['id']}`
                        }, (er, done) => {
                            if(done && done['status'] === 200){
                                setisloading(false);
                                onReset();
                                Toast.show({
                                    type: 'success',
                                    text1: 'Réussite',
                                    text2: 'Le champs a été ajouter avec succès !',
                                });
                                navigation.goBack()
                            }else{
                                setisloading(false);
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur',
                                    text2: 'Une erreur vient de se produire !',
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
                        text2: 'Séléctionner l\'agriculteur !',
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
                text2: 'Ajouter les dimensions du champs '
            });
        }
    };

    const __ = async () => {
        loadCultures();
        loadAgriculteurs();
        loadZones();
    };

    React.useEffect(() => {
        __()
        // console.log(" Selected item => ", item);
        // setcoords({
        //     latitude: parseFloat(-1.6734344),
        //     longitude: parseFloat(29.2325225)
        // })
    }, []);

    return(
        <>
            <Title 
                navigation={navigation}
                title={"Modification d'un champs"} 
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
                            onRefresh={ resetForm }
                        />
                    }
                >
                    <View style={{width: "90%", alignSelf: "center", paddingVertical: 10}}>
                        <Text style={{ paddingBottom: 6, marginTop: 0, fontFamily: "mons-b", fontSize: Dims.titletextsize }}>Modification d'un champs</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Formulaire de modifications d'un champs | remplissez les champs pour pouvoir l'ajouter dans le système </Text>
                    </View>
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <Divider />
                    </View>
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor,  marginTop: 10, paddingBottom: 100 }}>
                        <View style={{width: "90%", alignSelf: "center", marginTop: 0 }}>
                            {pos && Object.keys(pos).length > 0 && 
                                (
                                    <View style={{ flexDirection: "row" }}>
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
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 20 }}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse du champs | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <TextInput 
                                            value={nomchamps}
                                            onChangeText={ t => setchamps(t) } 
                                            placeholder='adresse du champs' 
                                            style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize, color: Colors.primaryColor }} 
                                        />
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <MaterialIcons name="leak-add" size={ Dims.iconsize - 4 } color={Colors.primaryColor} />
                                    </View>
                                </View>
                            </View>
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Dimensions</Text>
                                <View style={ inputGroup.container }>
                                    <View style={[ inputGroup.inputcontainer, { flexDirection: "row", alignContent: "center", alignItems: "center" }]}>
                                        <TextInput 
                                            value={dims ? parseInt(dims).toString() : ""}
                                            keyboardType='numeric'
                                            onChangeText={t => setdims(t)}
                                            placeholder='Ex: 120' 
                                            style={{ backgroundColor: Colors.pillColor, height: "100%", width: "65%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize, color: Colors.primaryColor }} 
                                        />
                                        <View style={{ backgroundColor: Colors.pillColor, width: "35%", height: "100%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.subtitletextsize - 2, color: Colors.primaryColor }}>Hectares ( ha )</Text>
                                        </View>
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <FontAwesome name="area-chart" size={ Dims.iconsize - 4 } color={Colors.primaryColor} />
                                    </View>
                                </View>
                            </View>
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Agriculteur <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                    {agr && agr['id'] 
                                        ?
                                            <TextInput 
                                                editable={false}
                                                style={[ inputGroup.input, { fontFamily: "mons", width: "100%", paddingRight: 20, paddingLeft: 20, textTransform: "capitalize" }]} 
                                                value={`${agr && agr['nom']} ${agr && agr['postnom']} | ${agr && agr['phone']}`} 
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
                                                placeholder={'Séléctionner l\'agriculteur'}
                                                searchPlaceholder="Recherche ..."
                                                // value={gender}
                                                // onFocus={() => setIsFocus(true)}
                                                // onBlur={() => setIsFocus(false)}
                                                onChange={item => {
                                                    setgender(item.id);
                                                    // setIsFocusg(false);
                                                }}
                                            />
                                    }
                                    </View>
                                    <View style={[ inputGroup.iconcontainer, { }]}>
                                        <Feather name="user" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Cultures <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                                {/* <View style={[ inputGroup.container, { overflow: "scroll" }]}>
                                    { ref.current.getSelectedItemsExt(selectedItems) }
                                </View> */}
                                <View style={{ width: "100%", minHeight: 65, flexDirection: "column", marginTop: 0, position: "absolute", top: 25, zIndex: 28972 }}>
                                    <MultiSelect
                                        hideTags
                                        items={culs}
                                        uniqueKey="id"
                                        displayKey="cultures"
                                        containerStyle={{ backgroundColor: "lime" }}
                                        ref={ ref }
                                        // styleItemsContainer={{ backgroundColor: "lime" }}
                                        styleListContainer={{ backgroundColor: Colors.whiteColor, paddingVertical: 0 }}
                                        styleMainWrapper={{ minHeight: 65, paddingTop: 0, paddingHorizontal: 0, elevation: Dims.elevation }}
                                        onSelectedItemsChange={ onSelectedItemsChange }
                                        selectedItems={selectedItems}
                                        selectText="Séléctionner les cultures"
                                        searchInputPlaceholderText="Rechercher d'une culture ..."
                                        onChangeInput={ (text) => console.log(text)}
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
                                    />
                                </View>
                            </View>
                            {/* -------------------------- */}
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Zone de production | <Text style={{ fontFamily: "mons-e" }}>( Facultatif )</Text></Text>
                                <View style={ inputGroup.container }>
                                    <View style={ inputGroup.inputcontainer }>
                                        <Dropdown
                                            style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%" }]}
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

                                            <View style={{ width: "33%" }}>
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

                                            <View style={{ width: "33%" }}>
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

                                            <View style={{ width: "33%" }}>
                                                <TouchableHighlight 
                                                    onPress={() => {
                                                        onSetCurrentPosition();
                                                    }}
                                                    underlayColor={ Colors.primaryColor }
                                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                                >
                                                    <>
                                                        <MaterialCommunityIcons name="map" size={ Dims.iconsize - 1 } color={ Colors.whiteColor } />
                                                        <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Map.</Text>
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
                                                ... Object.keys(coords).length > 0 ? coords : {
                                                    latitude: parseFloat(-1.6734344),
                                                    longitude: parseFloat(29.2325225)
                                                }
                                            }
                                        }
                                        style={{ width: Dims.width, height: Dims.height }} 
                                    >
                                        {
                                            Object.keys(coords).length > 0 && (
                                                <Marker
                                                    key={`${Math.random() * Math.random()}`}
                                                    coordinate={coords}
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
                                                if(Object.keys(coords).length > 0){
                                                    setisVisible(false);
                                                    setpos(coords);
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
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}
