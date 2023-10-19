import * as React from 'react';
import { View, Text, ScrollView, RefreshControl, SafeAreaView, TextInput, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { Divider } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { btn, buttons, inputGroup, modal } from '../../assets/styles/Styles';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { onRunExternalRQST, onRunExternalRQSTE } from '../../services/communications';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { toastConfig } from '../../assets/Toast/Toastconfig';
import NetInfos from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import MultiSelect from 'react-native-multiple-select';
import { Loader } from '../../components/Loader/comp.loader';
import { appname } from '../../assets/configs/configs';
import DialogBox from 'react-native-dialogbox';
import { remove_0_ToPhone_Number } from '../../assets/Helper/Helpers';
// import { PageScrollView } from 'pagescrollview';

export const AbonnemetScreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [markets, setmarkets] = React.useState([]);
    const [products, setproducts] = React.useState([]);
    const [lgs, setlgs] = React.useState([
        {
            id: 1,
            designation: "Français"
        },
        {
            id: 2,
            designation: "Swahili"
        }
    ]);
    const [packets, setpackets] = React.useState([]);
    const [isVisible, setisVisible] = React.useState(false);
    const [isVisibleA, setisVisibleA] = React.useState(false);
    const [output, setoutput] = React.useState("");
    const [phone, setphone] = React.useState("");
    const [selectedItems, setselectedItems] = React.useState([]);
    const [selectedItemsMarkets, setselectedItemsMarkets] = React.useState([]);

    const [market, setmarket] = React.useState("");
    const [packet, setpack] = React.useState("");
    const [lg, setlg] = React.useState("");
    const [title, settitle] = React.useState("");
    const [h, seth] = React.useState(0)
    const user = global.user;

    const ref = React.useRef();
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
                            { title.length > 0 ? <AntDesign name='warning' color={Colors.dangerColor} size={50}  /> : <MaterialIcons name='wifi-off' color={Colors.dangerColor} size={50} />}
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

    const onSelectedItemsChange = selectedItems => {
        setselectedItems(selectedItems);
    };

    const onSelectedItemsChangeMarket = selectedItemsMarket => {
        setselectedItemsMarkets(selectedItemsMarket)
    }

    const onLoadGlobalinfos = async () => {
        setisVisible(false);
        setoutput("");
        settitle("");
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                setisloading(true);
                onRunExternalRQST({
                    method: "GET",
                    url: '/collectors/load/infos/abonnement'
                }, (err, done) => {
                    if(done && done['status'] === 200){
                        const d = done['data'];
                        setmarkets(d && d['marches'])
                        setproducts(d && d['produits'])
                        setpackets(d && d['packets'])
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
                setisloading(false)
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
        setselectedItemsMarkets([])
        setselectedItems([])
        setphone("")
        onLoadGlobalinfos()
    };

    const handlePayement = async ({ payementMethode }) => {
        NetInfos.fetch().then(on => {
            if(on.isConnected){
                setisloading(true);
                setoutput("");
                setisVisibleA(false);
                onRunExternalRQST({
                    method: "POST",
                    url: `/collectors/collector/newsouscription`,
                    data: {
                        "phone": `+243${remove_0_ToPhone_Number({ phone: phone })}`,
                        "market": [
                            ...selectedItemsMarkets
                        ],
                        "language": lg,
                        "selectedproducts": [
                            ...selectedItems
                        ],
                        "packet": packet,
                        "parms": Math.floor(Math.random() * 10 * 10 * 10),
                        "paiementmethode": payementMethode,
                        "typesouscritpion": 1,
                        "idambassadeur": user && user['realid']
                    }
                }, (err, done) => {
                    if(done){
                        const s = done && done['status'];
                        switch (s) {
                            case 200:
                                setisloading(false);
                                refc.current.tip({
                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Abonnement</Text>,
                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >{appname} Votre abonnement a bien été pris en compte un message de confirmation vous sera envoyé sous peu!, Merci</Text>],
                                    btn: {
                                        text: 'OK, j\'ai compris',
                                        style: {
                                            color: Colors.primaryColor,
                                            fontFamily: 'mons',
                                            fontSize: Dims.subtitletextsize
                                        },
                                        callback: () => {
                                            onRefresh()
                                        }
                                    }
                                })
                                break;
                            case 400:
                                setisloading(false);
                                setisVisible(true);
                                setoutput(done && done['data']['message']);
                                settitle("Erreur de traitement");
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur de traitement',
                                    text2: `${done && done['message']}`,
                                })
                                break;
                            case 201:
                                setisloading(false);
                                setisVisible(true);
                                setoutput(done && done['data']['message']);
                                settitle("Erreur de traitement");
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur de traitement',
                                    text2: `${done && done['data']['message']}`,
                                })
                                break;
                            default:
                                setisVisible(true);
                                setisloading(false);
                                setoutput(" Nous avons rencotrer une erreur lors du traitement de vos informations ! ");
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur de traitement',
                                    text2: `Nous avons rencotrer une erreur lors du traitement de vos informations !`,
                                })
                                break;
                        }
                    }else{
                        setisVisible(true);
                        setisloading(false);
                        setoutput(" Nous avons rencotrer une erreur lors du traitement de vos informations ! ");
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur de traitement',
                            text2: `Nous avons rencotrer une erreur lors du traitement de vos informations !`,
                        })
                    }
                })
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Connexion internet!',
                    text2: `Vérifiez votre connexion internet puis réessayer !`,
                })
            }
        })
    };

    const handlConfirm = async () => {
        if(phone.length >= 9){
            if(selectedItemsMarkets.length > 0){
                if(packet.length > 0){
                    if(lg.toString().length > 0){
                        if(selectedItems.length > 0){
                            setisVisibleA(true);
                        }else{
                            Toast.show({
                                type: 'error',
                                text1: 'Champs obligatoire',
                                text2: `Séléctionner les produites agricoles`,
                            })
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Champs obligatoire',
                            text2: `Séléctionner une langue`,
                        })
                    }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Champs obligatoire',
                        text2: `Séléctionner un paquet`,
                    })
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Champs obligatoire',
                    text2: `Séléctionner au moins un marché`,
                });
            }
        }else{
            Toast.show({
                type: 'error',
                text1: 'Champs obligatoire',
                text2: `Entrer le numéro de téléphone `,
            });
        }
    };

    const handleScrollContentLayout = (e) => {
        const { height } = e.nativeEvent.layout
        // setScrollLayoutHeight(height)
        // seth(height)
        // console.log("New Heigt =>>>>>>>> ", height);
      }

    React.useEffect(() => {
        onLoadGlobalinfos()
    }, [])

    return(
        <>
            <Title 
                navigation={navigation}
                title={"Abonnement prix du marché"} 
                subtitle={"Formulaire d'abonnement"} 
            />
            <View 
                style={{ backgroundColor: Colors.whiteColor, paddingTop: Dims.borderradius, flexShrink: 1 }}
                onLayout={handleScrollContentLayout}
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={true}
                    // style={{ flex: 1 }}
                    contentOffset={{ x: 0, y: 0 }}
                    contentContainerStyle={{ 
                        paddingBottom: "110%"
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
                        <Text style={{ paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.titletextsize }}>Abonenment | <Text style={{ color: Colors.primaryColor }}>prix du marché</Text></Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Formulaire d'un nouvel abonenment | remplissez les champs pour pouvoir l'ajouter dans le système </Text>
                    </View>
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <Divider />
                    </View>
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Numéro de téléphone <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={[inputGroup.inputcontainer, { flexDirection: "row-reverse" }]}>
                                    <TextInput 
                                        keyboardType='phone-pad'
                                        onChangeText={t => setphone(t)}
                                        value={phone}
                                        autoComplete="off"
                                        maxLength={10}
                                        placeholder='Numéro de téléphone' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "80%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize, color: Colors.primaryColor }} 
                                    />
                                    <View style={{ width: "20%", alignContent: "center", alignItems: "flex-end", backgroundColor: Colors.pillColor, height: "100%", justifyContent: "center" }}>
                                        <Text style={{ fontFamily: "mons", textAlign: "right", color: Colors.primaryColor }}>+243</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* ======================================= */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Marché <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={{ width: "100%", minHeight: 65, flexDirection: "column", marginTop: 0, position: "absolute", top: 25, zIndex: 38972 }}>
                                <MultiSelect
                                    hideTags
                                    items={ markets }
                                    // hideSubmitButton
                                    uniqueKey="id"
                                    displayKey="designation"
                                    ref={ ref }
                                    styleListContainer={{ backgroundColor: Colors.whiteColor, paddingVertical: 0 }}
                                    styleMainWrapper={{ minHeight: 65, paddingTop: 0, paddingHorizontal: 0,  }}
                                    single={false}
                                    onSelectedItemsChange={(list) => {
                                            onSelectedItemsChangeMarket(list)
                                        }
                                    }
                                    selectedItems={ selectedItemsMarkets }
                                    selectText="Séléctionner les marchés"
                                    searchInputPlaceholderText="Rechercher un marché ..."
                                    onChangeInput={ (text) => {}}
                                    altFontFamily="mons-b"
                                    tagRemoveIconColor="#CCC"
                                    tagBorderColor="#CCC"
                                    tagTextColor="#CCC"
                                    // fixedHeight={true}
                                    // removeSelected
                                    selectedItemTextColor={Colors.primaryColor}
                                    selectedItemIconColor={Colors.primaryColor}
                                    itemTextColor={Colors.darkColor}
                                    styleItemsContainer={{ backgroundColor: "red" }}
                                    searchInputStyle={{ color: Colors.darkColor, height: 45, backgroundColor: Colors.whiteColor, paddingHorizontal: 10 }}
                                    submitButtonColor={Colors.primaryColor}
                                    styleDropdownMenuSubsection={{ paddingVertical: 0, marginTop: 0 }}
                                    submitButtonText="Ajouter les marchés séléctionés"
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
                                    fixedHeight={250}

                                    // onToggleList={() => {
                                    //     alert(1)
                                    // }}
                                />
                            </View>
                            {/* <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <Dropdown
                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                        containerStyle={{}}
                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                        data={markets}
                                        search
                                        maxHeight={ 200 }
                                        labelField="designation"
                                        valueField="id"
                                        placeholder={'Séléctionner un marché'}
                                        searchPlaceholder="Recherche ..."
                                        onChange={item => {
                                            setmarket(item.id)
                                        }}
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <Ionicons name="bookmark" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                </View>
                            </View> */}
                        </View>
                        {/* ======================================= */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Type d'abonnement <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <Dropdown
                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                        containerStyle={{}}
                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                        data={packets}
                                        search
                                        maxHeight={ 200 }
                                        labelField="designation"
                                        valueField="id"
                                        placeholder={'Séléctionner un pacquet'}
                                        searchPlaceholder="Recherche ..."
                                        onChange={item => {
                                            setpack(item.id)
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
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Langue <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <Dropdown
                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                        containerStyle={{}}
                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                        data={lgs}
                                        search
                                        maxHeight={ 200 }
                                        labelField="designation"
                                        valueField="id"
                                        placeholder={'Séléctionner une langue'}
                                        searchPlaceholder="Recherche ..."
                                        onChange={item => {
                                            setlg(item.designation)
                                        }}
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <Ionicons name="language" size={ Dims.iconsize - 4 } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* ======================================= */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Produits agricoles <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={{ width: "100%", minHeight: 65, flexDirection: "column", marginTop: 0, position: "absolute", top: 25, zIndex: 28972 }}>
                                <MultiSelect
                                    hideTags
                                    // hideSubmitButton
                                    items={products}
                                    uniqueKey="id"
                                    displayKey="designation"
                                    ref={ ref }
                                    styleListContainer={{ backgroundColor: Colors.whiteColor, paddingVertical: 0 }}
                                    styleMainWrapper={{ minHeight: 65, paddingTop: 0, paddingHorizontal: 0,  }}
                                    onSelectedItemsChange={ onSelectedItemsChange }
                                    selectedItems={selectedItems}
                                    selectText="Séléctionner les produits"
                                    searchInputPlaceholderText="Rechercher d'un produit ..."
                                    onChangeInput={ (text) => {}}
                                    altFontFamily="mons-b"
                                    tagRemoveIconColor="#CCC"
                                    tagBorderColor="#CCC"
                                    tagTextColor="#CCC"
                                    fontFamily='mons'
                                    // fixedHeight={true}
                                    // removeSelected
                                    selectedItemTextColor={Colors.primaryColor}
                                    selectedItemIconColor={Colors.primaryColor}
                                    itemTextColor={Colors.darkColor}
                                    styleItemsContainer={{ backgroundColor: "red" }}
                                    searchInputStyle={{ color: Colors.darkColor, height: 45, backgroundColor: Colors.whiteColor, paddingHorizontal: 10 }}
                                    submitButtonColor={Colors.primaryColor}
                                    styleDropdownMenuSubsection={{ paddingVertical: 0, marginTop: 0 }}
                                    submitButtonText="Ajouter les séléctions"
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
                                    fixedHeight={250}
                                />
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
                    <Footer />
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
                        sText: output && output.toString().length > 0 ? output.toString() : "Il semble que vous n'êtes pas connectez sur internet, vos informations peuvent être enregistrées en local; vous pouvew faire la synchronisation plus tard" 
                    }
                }
            />

            <View style={{ padding: 0, alignSelf: "center", overflow: "hidden", borderTopStartRadius: Dims.borderradius, borderTopEndRadius: Dims.borderradius, backgroundColor: Colors.whiteColor }}>
                <Modal
                    style={{ position: "absolute", width: "95%", bottom: -20, height: 80, overflow: "hidden", backgroundColor: Colors.whiteColor, alignSelf: "center", borderTopStartRadius: Dims.borderradius + 30, borderTopEndRadius: Dims.borderradius + 30 }}
                    isVisible={isVisibleA}
                    onBackButtonPress={() => { 
                        setisVisibleA(false)
                    }}
                    onBackdropPress={() => { 
                        setisVisibleA(false)
                    }}
                    onDismiss={() => { 
                        setisVisibleA(false)
                    }}
                >
                    <View style={{ padding: 2, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "space-around" }}>
                        <TouchableHighlight 
                            underlayColor={"transparent"}
                            onPress={() => {
                                handlePayement({ payementMethode: 2 })
                            }}
                            style={{ backgroundColor: Colors.pillColor, padding: 5, width: "45%", borderRadius: 0, borderTopStartRadius: Dims.borderradius + 20 }}
                        >
                            <View style={{ flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center", paddingVertical: 7  }}>
                                <Feather name="package" size={Dims.iconsize + 5} color={Colors.primaryColor} />
                                <Text style={{ fontFamily: "mons-e", fontSize: 10, paddingTop: 5 }} >Paiement par paquet</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={"transparent"}
                            onPress={() => {
                                handlePayement({ payementMethode: 1 })
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

            <DialogBox ref={refc} isOverlayClickClose={false} />
        </>
    )
}