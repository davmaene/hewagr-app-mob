import * as React from 'react';
import { View, Text, ScrollView, RefreshControl, SafeAreaView, TextInput, TouchableHighlight } from 'react-native';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { btn, buttons, inputGroup, modal } from '../../assets/styles/Styles';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { onRunExternalRQST, onRunExternalRQSTE } from '../../services/communications';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import { toastConfig } from '../../assets/Toast/Toastconfig';
import NetInfos from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import { Loader } from '../../components/Loader/comp.loader';
import { appname } from '../../assets/configs/configs';
import DialogBox from 'react-native-dialogbox';

export const CollectScreen = ({ navigation, route }) => {
    const [isloading, setisloading] = React.useState(false);
    const [unities, setunities] = React.useState([]);
    const [products, setproducts] = React.useState([]);
    const [currencies, setcurencies] = React.useState([
        {
            id: 1,
            designation: "CDF"
        },
        {
            id: 2,
            designation: "USD"
        }
    ]);
    const [isVisible, setisVisible] = React.useState(false);
    const [output, setoutput] = React.useState("");
    
    const [comments, setcomments] = React.useState("");
    const [produit, setproduit] = React.useState("");
    const [price, setprice] = React.useState("");
    const [unity, setunity] = React.useState("");
    const [currency, setcurrency] = React.useState("");

    const [title, settitle] = React.useState("");

    const refc = React.useRef();

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
                    <View style={{ width: "90%", flexDirection: "column", justifyContent: "space-between", alignSelf: "center", minHeight: 110 }}>
                        <View style={{ alignContent: "center", alignItems: "center", alignSelf: "center", marginTop: 20, marginBottom: 10 }}>
                            { title.length > 0 ? <Ionicons name='ios-cloud-offline-sharp' color={Colors.dangerColor} size={50}  /> : <MaterialIcons name='wifi-off' color={Colors.dangerColor} size={50} />}
                        </View>
                        <>
                            <View style={{ height: "auto", marginBottom: 50 }}>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.titletextsize, paddingTop: 5, textAlign: "center", color: color ? color : Colors.darkColor }}>{ text }</Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, textAlign: "center", color: sColor ? sColor : Colors.darkColor, paddingTop: 10 }}>{ sText }</Text>
                            </View>
                        </>
                    </View>
                </SafeAreaView>
                <Toast config={toastConfig} />
            </Modal>
        )
    };

    const onLoadGlobalinfos = async () => {
        setisVisible(false);
        setoutput("");
        settitle("");

        NetInfos.fetch().then(on => {
            if(on.isConnected){
                setisloading(true);
                onRunExternalRQSTE({
                    method: "POST",
                    url: '/produit/collecte/init'//'/collectors/load/infos/collecte'
                }, (err, done) => {

                    // if(done === undefined && err === undefined) navigation.replace("loadingsession")
                    // console.log(" Collecte informations => ", done);
                    // console.log(" Collecte informations error => ", err);

                    if(done && done['status'] === 200){
                        const d = done['data'];
                        // setmarkets(d && d['marches'])
                        setunities(d && d['unite'])
                        setproducts(d && d['produit'])
                        // setpackets(d && d['packets'])
                        setisloading(false);

                    }else{

                        setisloading(false);
                        setisVisible(true);
                        settitle("Chargement");
                        setoutput("Les informations relative sur le marché, les produits agricoles et les pacquets n'ont pas été chargé correctement nous vous conseillons alors de réessayer le chargement de ces dernières !")
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur de chargement des informations',
                            text2: `Les informations n'ont pas été chargé correctement `,
                        });
                    }
                })
            }else{
                setisVisible(true);
                settitle("")
                Toast.show({
                    type: 'error',
                    text1: 'Erreur de connexion',
                    text2: `La connexion internet n'est pas disponible `,
                });
                setoutput("")
            }
        })
    };

    const onRefresh = async () => {
        onLoadGlobalinfos()
    };

    const onResetForm = async () => {
        setproduit("");
        setunity("");
        setprice("");
        setcurrency("");
        setcomments("");
    };

    const handlConfirm = async () => {
        if(produit.toString().length > 0){
            if(unity.toString().length > 0){
                if(price.toString().length > 0){
                    if(currency.toString().toString().length > 0){
                        if(comments.toString().length >= 0){
                            setisloading(true);
                            setoutput("");

                            switch (global.iscollecteur) {
                                case 1:
                                    onRunExternalRQSTE({
                                        method: "POST",
                                        url: `/produit/collecte/create`,
                                        data: {
                                            "produit": produit,
                                            "unite": unity,
                                            "prix": price,
                                            "devise": currency,
                                            "commentaire": comments,
                                            "parms": Math.floor( Math.random() * ( 10 * 10 * 10 ) ) 
                                        }
                                    }, (err, done) => {
                                        if(done){
                                            const s = done && done['status'];
                                            switch (s) {
                                                case 200:
                                                    setisloading(false);
                                                    refc.current.tip({
                                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Collecte</Text>,
                                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vos infotmations ont été bien enregistrées dans le système {appname}</Text>],
                                                        btn: {
                                                            text: 'OK, j\'ai compris',
                                                            style: {
                                                                color: Colors.primaryColor,
                                                                fontFamily: 'mons',
                                                                fontSize: Dims.subtitletextsize
                                                            },
                                                            callback: () => {
                                                                onResetForm()
                                                            }
                                                        }
                                                    })
                                                    break;
                                                case 201:
                                                    setoutput(done && done['message']);
                                                    settitle("Erreur de traitement")
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de traitement',
                                                        text2: `${done && done['message']}`,
                                                    });
                                                    setisVisible(true);
                                                    setisloading(false);
                                                    break;
                                                case 400:
                                                    setisloading(false);
                                                    setisVisible(true);
                                                    setoutput(done && done['message']);
                                                    settitle("Erreur de traitement")
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de traitement',
                                                        text2: `${done && done['message']}`,
                                                    })
                                                    break;
                                                default:
                                                    setisVisible(true);
                                                    console.log(err);
                                                    console.log(done);
                                                    setisloading(false)
                                                    setoutput(" Nous avons rencotrer un problème lors du traitement de vos informations ! ");
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de traitement',
                                                        text2: `Nous avons rencotrer un problème lors du traitement de vos informations !`,
                                                    })
                                                    break;
                                            }
                                        }else{
                                            setisVisible(true);
                                            console.log(err);
                                            console.log(done);
                                            setoutput("Nous avons rencotrer un problème lors du traitement de vos informations !");
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Erreur de traitement',
                                                text2: `Nous avons rencotrer un problème lors du traitement de vos informations !`,
                                            })
                                        }
                                    })
                                    break;
                                case 0:
                                    onRunExternalRQST({
                                        method: "POST",
                                        url: `/collectors/collector/newcollection`,
                                        data: {
                                            "produit": produit,
                                            "unity": unity,
                                            "price": price,
                                            "currency": currency,
                                            "commentaire": comments,
                                            "parms": Math.floor( Math.random() * ( 10 * 10 * 10 ) )                                
                                        }
                                    }, (err, done) => {
                                        if(done){
                                            const s = done && done['status'];
                                            switch (s) {
                                                case 200:
                                                    setisloading(false);
                                                    refc.current.tip({
                                                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Collecte</Text>,
                                                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vos infotmations ont été bien enregistrées dans le système {appname}</Text>],
                                                        btn: {
                                                            text: 'OK, j\'ai compris',
                                                            style: {
                                                                color: Colors.primaryColor,
                                                                fontFamily: 'mons',
                                                                fontSize: Dims.subtitletextsize
                                                            },
                                                            callback: () => {
                                                                onResetForm()
                                                            }
                                                        }
                                                    })
                                                    break;
                                                case 201:
                                                    setoutput(done && done['message']);
                                                    settitle("Erreur de traitement")
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de traitement',
                                                        text2: `${done && done['message']}`,
                                                    })
                                                    break;
                                                case 400:
                                                    setisloading(false);
                                                    setisVisible(true);
                                                    setoutput(done && done['message']);
                                                    settitle("Erreur de traitement")
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de traitement',
                                                        text2: `${done && done['message']}`,
                                                    })
                                                    break;
                                                default:
                                                    setisVisible(true);
                                                    setisloading(false)
                                                    setoutput(" Nous avons rencotrer un problème lors du traitement de vos informations ! ");
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur de traitement',
                                                        text2: `Nous avons rencotrer un problème lors du traitement de vos informations !`,
                                                    })
                                                    break;
                                            }
                                        }else{
                                            setisVisible(true);
                                            setoutput("Nous avons rencotrer un problème lors du traitement de vos informations !");
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Erreur de traitement',
                                                text2: `Nous avons rencotrer un problème lors du traitement de vos informations !`,
                                            })
                                        }
                                    })
                                    break;
                                default:
                                    Toast.show({
                                        type: 'warning',
                                        text1: 'Collecte',
                                        text2: `Cette fonctionnalité est temporairement indisponnible !`,
                                    })
                                    break;
                            }
                        }else{
                            Toast.show({
                                type: 'error',
                                text1: 'Champs obligatoire',
                                text2: `La taille du commentaire doir avoir au moins 5 catactères !`,
                            })
                        }
                    }else{
                        // alert(lg)
                        Toast.show({
                            type: 'error',
                            text1: 'Champs obligatoire',
                            text2: `Séléctionner une dévise ( USD ou CDF )`,
                        })
                    }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Champs obligatoire',
                        text2: `Entrer le prix du produite !`,
                    })
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Champs obligatoire',
                    text2: `Séléctionner une unité de mésure !`,
                });
            }
        }else{
            Toast.show({
                type: 'error',
                text1: 'Champs obligatoire',
                text2: `Séléctionner un produit !`,
            });
        }
    };

    React.useEffect(() => {
        onLoadGlobalinfos()
    }, [])

    return(
        <>
            <Title 
                navigation={navigation}
                title={"Collecte"} 
                subtitle={"Collecte des données "} 
            />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingTop: Dims.borderradius }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingBottom: "100%"
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
                        <Text style={{ paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Collecte</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Formulaire de collecte des informations relatives sur les prix du marché </Text>
                    </View>
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <Divider />
                    </View>
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        {/* ======================================= */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Produit <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <Dropdown
                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                        containerStyle={{}}
                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                        data={products}
                                        search
                                        value={produit}
                                        maxHeight={ 200 }
                                        labelField="designation"
                                        valueField="id"
                                        placeholder={'Séléctionner un produit'}
                                        searchPlaceholder="Recherche ..."
                                        onChange={item => {
                                            setproduit(item.id)
                                        }}
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <Ionicons name="bookmark" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* ======================================= */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Unité de mésure <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <Dropdown
                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                        containerStyle={{}}
                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                        data={unities}
                                        search
                                        maxHeight={ 200 }
                                        labelField="designation"
                                        valueField="id"
                                        placeholder={'Séléctionner une unité '}
                                        searchPlaceholder="Recherche ..."
                                        onChange={item => {
                                            setunity(item.id)
                                        }}
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <Ionicons name="bookmark" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* ==================================== */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Prix <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: "50%" }}>
                                    <View style={[ inputGroup.container, { } ]}>
                                        <View style={[ inputGroup.inputcontainer, { width: "100%" } ]}>
                                            <TextInput 
                                                value={price}
                                                maxLength={7} 
                                                keyboardType='numeric' 
                                                onChangeText={e => setprice(e)} 
                                                placeholder='Prix' style={{ color: Colors.primaryColor, backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: "2%" }} />
                                <View style={{ width: "48%" }}>
                                    <View style={ inputGroup.container }>
                                        <View style={[ inputGroup.inputcontainer, { width: "100%" } ]}>
                                            <Dropdown
                                                style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                                placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                                containerStyle={{}}
                                                selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                                inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                                data={currencies}
                                                // search
                                                maxHeight={ 200 }
                                                labelField="designation"
                                                valueField="id"
                                                placeholder={'Dévise... '}
                                                searchPlaceholder="Recherche ..."
                                                onChange={item => {
                                                    setcurrency(item.designation)
                                                }}
                                            />
                                        </View>
                                        {/* <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.pillColor, width: "42%" }]}>
                                            <MaterialCommunityIcons name="currency-eur" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                        </View> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* ======================================= */}
                        <View style={{width: "100%", height: "auto", flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Commentaire </Text>
                            <View style={[inputGroup.container, { height: 100 }]}>
                                <View style={[inputGroup.inputcontainer, { flexDirection: "row-reverse", height: 100 }]}>
                                    <TextInput 
                                        keyboardType='ascii-capable'
                                        onChangeText={t => setcomments(t)}
                                        // value={phone}
                                        // maxLength={9}
                                        multiline
                                        placeholder='Entrer un commentaire ou une description ...' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize, color: Colors.primaryColor }} 
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, {  }]}>
                                    <Entypo name="edit" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* ======================================= */}
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                            <TouchableHighlight 
                                onPress={handlConfirm}
                                underlayColor={ Colors.primaryColor }
                                style={[btn]}
                            >
                                {isloading 
                                ?
                                    <Loader />
                                :
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Confirmer</Text>    
                                }
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomSheetDialog
                navigation={navigation} 
                visible={isVisible} 
                title={
                    {
                        color: Colors.dangerColor, 
                        text: title.length > 0 ? title : "Connectivité"
                    }
                } 
                subTitle={
                    { 
                        sColor: Colors.darkColor, 
                        sText: output.length > 0 ? output : "Il semble que vous n'êtes pas connectez sur internet, vos informations peuvent être enregistrées en local; vous pouvew faire la synchronisation plus tard" 
                    }
                }
            />
            <DialogBox ref={refc} isOverlayClickClose={false} />
            <Footer />
        </>
    )
}