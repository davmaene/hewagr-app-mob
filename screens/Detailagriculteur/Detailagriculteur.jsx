import * as React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Footer } from '../../components/Footer/comp.footer';
import { InBuild } from '../../components/InBuild/com.inbuild';
import { Title } from '../../components/Title/Title';
import { onRunExternalRQST } from '../../services/communications';
import Toast from 'react-native-toast-message';
import { Avatar, Divider } from 'react-native-elements';
import { Feather, FontAwesome5, Entypo, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { returnInitialOfNames } from '../../assets/Helper/Helpers';
import { ScrollView } from 'react-native';
import * as Linking  from 'expo-linking';
import { RefreshControl } from 'react-native';
import { TouchableHighlight } from 'react-native';

export const DetailsAgriculteurScreen = ({ navigation, route }) => {

    const item = route && route['params'] && route['params']['item'];
    const [champs, setchamps] = React.useState([]);
    const [isloading, setisloading] = React.useState(false);
    const [coopec, setcoopec] = React.useState({})
    const color = Colors.primaryColor;// randomColor() ||

    const onLoadChamps = async () => {  
        setisloading(true);
        await onRunExternalRQST({
            method: "GET",
            url: `/champs/agri/liste/${item && item['id']}`
        }, (er, liste) => {
            if(liste && liste['status'] === 200){
                setchamps(liste && liste['data'] && liste['data']['liste'])
                setisloading(false);
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Le chargement de champs à échoué!',
                });
                setisloading(false);
            }
        })
    };

    const onLoadCooperativeById = async () => {
        setisloading(true);
        await onRunExternalRQST({
            method: "GET",
            url: `/cooperatives/cooperative/${item && item['membrecooperative'] !== "#" ? item['membrecooperative'] : 0}`
        }, (er, liste) => {
            if(liste && liste['status'] === 200){
                setcoopec(liste && liste['data']);
                setisloading(false);
            }else{
                // Toast.show({
                //     type: 'error',
                //     text1: 'Erreur',
                //     text2: 'Le chargement de la coop. à échoché!',
                // });
                setisloading(false);
            }
        })
    };

    const onRefresh = () => {
        onLoadChamps()
        if(item && item['membrecooperative'] !== "#") onLoadCooperativeById()
    };

    React.useEffect(() => {
        onRefresh()
    }, [])

    // console.log(champs);
    return(
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <Title title={`${item && item['nom']} ${item && item['postnom']}`} subtitle={"Détail d'un agriculteur"} navigation={navigation} /> 
            <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <>
                            <Avatar
                                title={
                                    <Text style={{ textTransform: "uppercase", fontFamily: "mons-b", fontSize: Dims.titletextsize }}>
                                        {returnInitialOfNames({ fsname: item && item['nom'], lsname: item && item['postnom'] })}
                                    </Text>
                                }
                                onPress={() => Linking.openURL(`tel:${item && item['phone']}`)}
                                containerStyle={{ backgroundColor: color, borderRadius: Dims.borderradius }}
                                size="large"
                                key={item && item['id']}
                            />
                        </>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: "mons", textTransform: "capitalize" }}>{item && item['nom']} {item && item['postnom']}</Text>
                            <Text style={{ fontFamily: "mons-e" }}>{item && item['phone']}</Text>
                            <Text style={{ fontFamily: "mons-e" }}>{item && item['email'] ? item['email'] : "---"}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                    <TouchableHighlight
                        underlayColor={ Colors.pillColor }
                        onPress={() => { navigation.navigate("souscription", { item: item, id: item && item['id'] }) }}
                        style={{ flexDirection: "row", alignContent: "center", alignItems: "center", padding: 8, backgroundColor: Colors.pillColor }}
                    >
                        <>
                            <Ionicons name="add-circle-sharp" size={Dims.iconsize} color={ color } />
                            <Text style={{ fontFamily: "mons", fontSize: 11, paddingHorizontal: 6 }}>Souscription</Text>
                        </>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={ Colors.pillColor }
                        onPress={() => { navigation.navigate("addchamps", { item: item, id: item && item['id'] }) }}
                        style={{ flexDirection: "row", alignContent: "center", alignItems: "center", padding: 8, backgroundColor: Colors.pillColor }}
                    >
                        <>
                            <Ionicons name="add-circle-sharp" size={Dims.iconsize} color={ color } />
                            <Text style={{ fontFamily: "mons", fontSize: 11, paddingHorizontal: 6 }}>Ajout champs</Text>
                        </>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={ () => navigation.navigate("edit-agriculteur", { item: item, id: item && item['id'] }) }
                        underlayColor={ Colors.pillColor }
                        style={{ flexDirection: "row", alignContent: "center", alignItems: "center", padding: 8, backgroundColor: Colors.pillColor }}
                    >
                        <>
                            <Feather name="edit" size={Dims.iconsize} color={ color } />
                            <Text style={{ fontFamily: "mons", fontSize: 11, paddingHorizontal: 6 }}>Modifier</Text>
                        </>
                    </TouchableHighlight>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <ScrollView
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={{ paddingBottom: "100%" }}
                    refreshControl={
                        <RefreshControl 
                            onRefresh={onRefresh}
                            refreshing={isloading}
                            colors={[Colors.primaryColor]}
                        />
                    }
                >
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ marginTop: 10, padding: 10, backgroundColor: Colors.pillColor }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Agriculteur</Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Informations sur l'agiculteur</Text>
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Nom</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['nom']}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Postnom</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['postnom']}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Prenom</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && (item['prenom'] !== "#" && item['prenom'] !== "") ? item['prenom'] : "---"}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Numéro de téléphone</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['phone'] !== "#" && item['phone'] !== "" ? item['phone'] : "---"}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Adresse email</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "lowercase" }}>{item && item['email'] !== "#" && item['email'] !== "" ? item['email'] : "---"}</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 10, padding: 10, backgroundColor: Colors.pillColor }}>
                            <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Champs</Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Informations sur le champs de cet agriculteur</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "mons", borderRadius: Dims.borderradius, fontSize: Dims.titletextsize, color: Colors.pillColor, padding: 10, backgroundColor: Colors.primaryColor }}>{champs && champs['length']}</Text>
                                </View>
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            {champs.map((v, i) => {
                                return (
                                    <View style={{}} key={Math.random() * i}>
                                        <View style={{ marginBottom: 10 }} key={i * Math.random() * Math.random()}>
                                            <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Champs</Text>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{v && v['champs']}</Text>
                                        </View>
                                        <View style={{ marginBottom: 10 }} key={i + Math.random() }>
                                            <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Latitude</Text>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{v && v['latitude']}</Text>
                                        </View>
                                        <View style={{ marginBottom: 10 }} key={i + Math.random() }>
                                            <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Longitude</Text>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{v && v['longitude']}</Text>
                                        </View>
                                        <View style={{ marginBottom: 10 }} key={i + Math.random() }>
                                            <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Dimensions</Text>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{v && v['dimensions']}(ha)</Text>
                                        </View>
                                        <Divider style={{ marginVertical: 8 }} />
                                    </View>
                                )
                            })}
                        </View>

                        <View style={{ marginTop: 10, padding: 10, backgroundColor: Colors.pillColor }}>
                            <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Coopérative</Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Informations sur la cooperative</Text>
                                </View>
                                {/* <View>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, color: Colors.pillColor, padding: 10, backgroundColor: Colors.primaryColor }}>{champs && champs['length']}</Text>
                                </View> */}
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Membre d'une coopérative</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['membrecooperative'] !== "#" ? "OUI" : "NON" }</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Coopérative</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['membrecooperative'] !== "#" ? coopec['cooperative'] : "---" }</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Contact Coopérative</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['membrecooperative'] !== "#" ? coopec['phone'] : "---" }</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Contact Email Coopérative</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['membrecooperative'] !== "#" ? coopec['email'] !== "#" ? coopec['email'] : "---" : "---" }</Text>
                            </View>
                        </View>
                        
                    </View>
                    <Footer/> 
                </ScrollView>
            </View>
        </View>
    )
}