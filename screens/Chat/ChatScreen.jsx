import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, Modal, FlatList } from 'react-native';
import { btn, inputGroup } from '../../assets/styles/Styles';
import { Title } from '../../components/Title/Title';
import { Colors } from '../../assets/colors/Colors';
import { AntDesign, Entypo, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { onRunExternalRQST, onRunInsertQRY, onRunRawQRY, onRunRetrieveQRY } from '../../services/communications';
import { Dropdown } from 'react-native-element-dropdown';
import { Dims } from '../../assets/dimensions/Dimemensions';
import Toast from 'react-native-toast-message';
import { Footer } from '../../components/Footer/comp.footer';
import { Loader } from '../../components/Loader/comp.loader';
import { toastConfig } from '../../assets/Toast/Toastconfig';
import { EmptyList } from '../../components/Emptylist/com.emptylist';

export const ChatScreen = ({ navigation, route }) => {

    const [message, setmessage] = React.useState("");
    const user = 1 && global.user;
    const [canaddet, setcanaddet] = React.useState(false);
    const [hosps, sethops] = React.useState([]);
    const [hosp, sethosp] = React.useState([]);
    const [temp, settemp] = React.useState([]);
    const [isloading, setisloading] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);
    const [valtosend, setvaltusend] = React.useState(0);
    const [showup, setshowup] = React.useState(user && user['hospitalref']); // 
    const [chats, setchats] = React.useState([]);

    const [tokento, settokento] = React.useState("");

    const loadHospitals = async () => {
        await onRunExternalRQST({
            method: "GET",
            url: "/hospitals/list"
        }, (err, done) => {
            if(done && done['status'] === 200){
                sethops(done['data'])
                settemp(done['data'])
            }else{
                // console.log(done);
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Erreur de chargement des informations ...',
                });
            }
        })
    };

    const updateHospref = async () => {
        if(valtosend > 0){
            setisloading(true);
            onRunExternalRQST({
                method: "PUT",
                data: {
                    id: user && user['id'],
                    phone: user && user['phone'],
                    hospitalref: valtosend
                },
                url: `/users/user/updatehospitalref`
            }, (err, done) => {
                if(done && done['status'] === 200){
                    onRunRawQRY({
                        table: "__tbl_users",
                        sql: `update __tbl_users set hospitalref = ${valtosend}`
                    }, (er, dn) => {
                        if(dn){
                            global.user = done['data'];
                            setisloading(false);
                            setshowup(true);
                            setcanaddet(false);
                            Toast.show({
                                type: 'success',
                                text1: 'Mis à jour',
                                text2: 'Le numéro de référence a été mis à jour !',
                            });
                        }else{
                            setisloading(false);
                            Toast.show({
                                type: 'error',
                                text1: 'Mis à jour',
                                text2: 'Les mis à jours ont échouées !',
                            });
                        }
                    })
                }else{
                    setisloading(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Une erreur inconnue vient de se produire !',
                    });
                }
            })
        }else{
            setisloading(false);
            Toast.show({
                type: 'error',
                text1: 'Champ obligatoire',
                text2: 'Séléctionner un établissement !',
            });
        }
    };

    const loadChatFeed = async () => {
        await onRunRetrieveQRY({
            table: `__tbl_chats`,
            limit: 100
        }, (er, done) => {
            if(done) setchats(done);
            else{
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Erreur de chargement des informations ...',
                });
            }
        })
    };

    const onsendmessage = async () => {
        if(message.length >= 3){
            setisloading(true)
            onRunExternalRQST({
                method: "POST",
                url: `/users/user/sendmessage`,
                data: {
                    to: `${global['user']['hospitalref']}`, 
                    fil: `fil-${global['user']['id']}-${global['user']['hospitalref']}`, 
                    content: message, 
                    hospitalref: global['user']['hospitalref'],
                    from: global['user']['id'], 
                    from_token: global['token'], 
                    to_token:"" 
                }
            }, 
            (err, done) => {
                if(done && done['status'] === 200){
                    const c = done && done['data'] 
                    onRunInsertQRY({
                        columns: 'content, fill, from_, from_token, to_, to_token, crearedon',
                        dot: "?, ?, ?, ?, ?, ?, ?",
                        table: "__tbl_chats",
                        values: [c.content, c.fill, c.from, c.from_token, c.to, c.to_token, c.createdon]
                    }, (er, dn) => {
                        if(dn){
                            setisloading(false);
                            Toast.show({
                                type: 'success',
                                text1: 'Message envoyé',
                                text2: 'Le message a été envoyé avec succès !' ,
                            });
                            setmessage("")
                            loadChatFeed()
                        }else{
                            setisloading(false)
                            console.log(er);
                            Toast.show({
                                type: 'info',
                                text1: 'Message envoyé',
                                text2: 'Le message envoyé mais les configurations n\'ont pas aboutit !' ,
                            });
                        }
                    })
                }else{
                    setisloading(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Message non envoyé',
                        text2: 'Le message n\'a pas pû être envoyé' ,
                    });
                }
            })
        }else{
            Toast.show({
                type: 'error',
                text1: 'Champs obligatoire !',
                text2: 'Vous devez reseigner le contenu du message !',
            });
        }
    };

    const renderItem = ({ item }) => {
        return(
            <View style={{ flexDirection: "column", width: "100%", paddingHorizontal: 15, paddingTop: 10 }}>
                { item && parseInt(item['from_']) === global['user']['id']
                ?
                    (
                        <View style={{ width: "75%", alignSelf: "flex-start" }}>
                            <View style={{ backgroundColor: Colors.primaryColor, padding: 20, borderRadius: Dims.borderradius, marginTop: 5 }}>
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons-e" }}>{item['content']}</Text>
                            </View>  
                            <Text style={{ fontFamily: "mons-b", fontSize: 10, marginLeft: 20, marginTop: 2 }}>{item['crearedon']}</Text>
                        </View>

                    )
                :
                    (
                        <View style={{ width: "75%", alignSelf: "flex-end" }}>
                            <View style={{ backgroundColor: Colors.secondaryColor, padding: 20, borderRadius: Dims.borderradius, marginTop: 5 }}>
                                <Text style={{ color: Colors.whiteColor, fontFamily: "mons-e" }}>{item['content']}</Text>
                            </View>  
                            <Text style={{ fontFamily: "mons-b", fontSize: 10, marginLeft: 20, marginTop: 2 }}>{item['crearedon']}</Text>
                        </View>
                    )
                }
            </View>
        )
    };

    React.useEffect(() => {
        loadChatFeed();
        loadHospitals();
    }, []);

    return(
        <>
            <Title 
                title={`Chat | Conversation`} 
                subtitle={"Chatez avec votre hôpital "} />
            {
               showup 
            ?
                <>
                    <View>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: "80%" }}
                            renderItem={renderItem}
                            ListEmptyComponent={ <EmptyList/> }
                            keyboardDismissMode
                            data={chats}
                            keyExtractor={(item) => `${item.id}`}
                        />
                    </View>
                    <View style={ { position: "absolute", width: "100%", backgroundColor: Colors.whiteColor, padding: 4, paddingTop: 0, bottom: 0, paddingHorizontal: 10 } }>
                        <View style={[ inputGroup.container, { flexDirection: "row-reverse" } ]}>
                            <View style={{ width: "80%", justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                                <TextInput 
                                    placeholder='Bonjour ...' 
                                    multiline
                                    value={message}
                                    keyboardType={"default"} 
                                    onChangeText={(t) => setmessage(t)} 
                                    style={[ inputGroup.input, { fontFamily: "mons", width: "75%" }]} 
                                />
                                <TouchableHighlight 
                                    onPress={onsendmessage}
                                    disabled={isloading}
                                    style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor, width: "27%" }]}
                                >
                                    {
                                        isloading
                                    ?
                                        <Loader color={ Colors.whiteColor } />
                                    :
                                        <MaterialIcons name='send' size={Dims.iconsize} color={ Colors.whiteColor } />
                                    }
                                </TouchableHighlight>
                            </View>
                            <TouchableHighlight
                                underlayColor={Colors.primaryColor}
                                style={[ inputGroup.iconcontainer, { backgroundColor: Colors.pillColor }]}
                            >
                                <Entypo name="edit" size={Dims.iconsize} color={ Colors.primaryColor } />
                            </TouchableHighlight>
                        </View>
                    </View>
                </>
            :
                <>
                    <View style={{flex: 1, justifyContent: "center"}}>
                        <View style={{width: "90%", alignSelf: "center"}}>
                            <Text style={{ textAlign: "center", paddingBottom: 6, marginTop: 0, fontFamily: "mons", fontSize: Dims.bigtitletextsize }}>Etablissement sanitaire manquente.</Text>
                            <Text style={{ textAlign: "center", alignSelf: "center", fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Nous venons de détécter que votre compte n'est lié à aucun établissement sanitaire pour commencer le chat.</Text>
                            <View style={{ marginTop: 20 }}>
                                <TouchableHighlight
                                    underlayColor={ Colors.primaryColor }
                                    onPress={() => setcanaddet(true)}
                                    style={[btn]}
                                >
                                    <>
                                        <Ionicons name='add-circle-outline' color={ Colors.whiteColor } />
                                        <Text style={{ fontFamily: "mons", paddingHorizontal: 10, color: Colors.whiteColor }}>Ajouter un établissement</Text>
                                    </>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </>
            }
            <Modal
                visible={canaddet}
                onDismiss={() => setcanaddet(false)}
            >
                <Title title={"Etablissement sanitaire"} subtitle={"Ajout d'un établissement sanitaire "} navigation={navigation} action={() => setcanaddet(false) } />
                <View>
                    <View style={{width: "90%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: 15}}>
                        <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Hôpital de reférence </Text>
                        <View style={ inputGroup.container }>
                            <View style={ inputGroup.inputcontainer }>
                                <Dropdown
                                    style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%" }]}
                                    placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                    containerStyle={{}}
                                    selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                    inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                    data={hosps}
                                    search
                                    maxHeight={ 200 }
                                    labelField="name"
                                    valueField="id"
                                    placeholder={!isFocus ? 'Séléctionner un établissement' : '...'}
                                    searchPlaceholder="Recherche ..."
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setvaltusend(item.id);
                                        sethosp(item.name);
                                        setIsFocus(false);
                                    }}
                                />
                            </View>
                            <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                <FontAwesome5 name="hospital-symbol" size={ Dims.iconsize } color={ Colors.whiteColor } />
                            </View>
                        </View>
                    </View>
                    {/* -------------------------- */}
                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                            <TouchableHighlight 
                                underlayColor={Colors.primaryColor}
                                onPress={() => {
                                    updateHospref()
                                }}
                                style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                            >
                                {isloading ? <Loader color={Colors.whiteColor} /> : <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Ajouter</Text>}
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <Footer/>
                <Toast config={toastConfig} />
            </Modal>
        </>
    )
}