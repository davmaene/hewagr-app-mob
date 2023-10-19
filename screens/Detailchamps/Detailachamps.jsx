import * as React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { onRunExternalRQST } from '../../services/communications';
import Toast from 'react-native-toast-message';
import { Avatar, Divider } from 'react-native-elements';
import { Feather, FontAwesome5, Entypo, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { convertStringIntoArray, returnInitialOfNames } from '../../assets/Helper/Helpers';
import { ScrollView } from 'react-native';
import * as Linking  from 'expo-linking';
import { RefreshControl } from 'react-native';
import { TouchableHighlight } from 'react-native';
import { map } from '../../assets/styles/Styles';
import Modal from 'react-native-modal';
import { Loader } from '../../components/Loader/comp.loader';
import MultiSelect from 'react-native-multiple-select';

export const DetailsChampsscreen = ({ navigation, route }) => {

    const item = route && route['params'] && route['params']['item'];
    const agr = item && item['__tbl_agriculteur'];
    const i = agr && agr['id'];
    const [cultures, setcultures] = React.useState([]);
    const [isloading, setisloading] = React.useState(false);
    const color = Colors.primaryColor;// randomColor() ||
    const [isvisible, setisVisible] = React.useState(false);
    const [culs, setculs] = React.useState([]);
    const ref = React.useRef();
    const [selectedItems, setselectedItems] = React.useState(convertStringIntoArray({ chaine: item && item['idculture'] }));

    const onSelectedItemsChange = selectedItems => {
        setselectedItems(selectedItems);
        // console.log(" Selcted items are => ", selectedItems);
    };

    const onLoadCulturesChamps = async () => {  
        setisloading(true);
        await onRunExternalRQST({
            method: "PUT",
            url: `/cultures/culture/liste`,
            data: {
                ids: item && item['idculture']
            }
        }, (er, liste) => {
            if(liste && liste['status'] === 200){
                setcultures(liste && liste['data'] && liste['data']['liste'])
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

    const onRefresh = () => {
        loadCultures();
        onLoadCulturesChamps();
        // if(item && item['membrecooperative'] !== "#") onLoadCooperativeById()
    };

    React.useEffect(() => {
        onRefresh()
    }, [])

    return(
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <Title title={`Champs de ${agr && agr['nom']} ${agr && agr['postnom']}`} subtitle={"Détail d'un champs"} navigation={navigation} /> 
            <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <>
                            <Avatar
                                title={
                                    <Text style={{ textTransform: "uppercase", fontFamily: "mons-b", fontSize: Dims.titletextsize }}>
                                        {returnInitialOfNames({ fsname: agr && agr['nom'], lsname: agr && agr['postnom'] })}
                                    </Text>
                                }
                                onPress={() => Linking.openURL(`tel:${agr && agr['phone']}`)}
                                containerStyle={{ backgroundColor: color, borderRadius: Dims.borderradius }}
                                size="large"
                                key={item && item['id']}
                            />
                        </>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: "mons", textTransform: "capitalize" }}>{agr && agr['nom']} {agr && agr['postnom']}</Text>
                            <Text style={{ fontFamily: "mons-e" }}>{agr && agr['phone']}</Text>
                            <Text style={{ fontFamily: "mons-e" }}>{agr && agr['email'] ? agr['email'] : "---"}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                    <TouchableHighlight
                        underlayColor={ Colors.pillColor }
                        onPress={() => { setisVisible(true) }}
                        style={{ flexDirection: "row", alignContent: "center", alignItems: "center", padding: 8, backgroundColor: Colors.pillColor, width: "45%" }}
                    >
                        <>
                            <Ionicons name="add-circle-sharp" size={Dims.iconsize} color={ color } />
                            <Text style={{ fontFamily: "mons", fontSize: 11, paddingHorizontal: 6 }}>Ajouter une culture</Text>
                        </>
                    </TouchableHighlight>
                    {/* <TouchableHighlight
                        underlayColor={ Colors.pillColor }
                        onPress={() => { navigation.navigate("addchamps", { item: item, id: item && item['id'] }) }}
                        style={{ flexDirection: "row", alignContent: "center", alignItems: "center", padding: 8, backgroundColor: Colors.pillColor }}
                    >
                        <>
                            <Ionicons name="add-circle-sharp" size={Dims.iconsize} color={ color } />
                            <Text style={{ fontFamily: "mons", fontSize: 11, paddingHorizontal: 6 }}>Ajout champs</Text>
                        </>
                    </TouchableHighlight> */}
                    <TouchableHighlight
                        onPress={ () => navigation.navigate("edit-champs", { item: item, id: item && item['id'] }) }
                        underlayColor={ Colors.pillColor }
                        style={{ flexDirection: "row", alignContent: "center", alignItems: "center", padding: 8, backgroundColor: Colors.pillColor, width: "45%" }}
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
                            <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Champs</Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Informations sur le champs</Text>
                                </View>
                                {/* <View>
                                    <Text style={{ fontFamily: "mons", borderRadius: Dims.borderradius, fontSize: Dims.titletextsize, color: Colors.pillColor, padding: 10, backgroundColor: Colors.primaryColor }}>{champs && champs['length']}</Text>
                                </View> */}
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{}} key={Math.random() * i}>
                                <View style={{ marginBottom: 10 }} key={i * Math.random() * Math.random()}>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Champs</Text>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['champs']}</Text>
                                </View>
                                <View style={{ marginBottom: 10 }} key={i + Math.random() }>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Latitude</Text>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['latitude']}</Text>
                                </View>
                                <View style={{ marginBottom: 10 }} key={i + Math.random() }>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Longitude</Text>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['longitude']}</Text>
                                </View>
                                <View style={{ marginBottom: 10 }} key={i + Math.random() }>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Dimensions</Text>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{item && item['dimensions']} hectares ( ha )</Text>
                                </View>
                                <Divider style={{ marginVertical: 8 }} />
                            </View>
                        </View>

                        <View style={{ marginTop: 10, padding: 10, backgroundColor: Colors.pillColor }}>
                            <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Cultures</Text>
                                    <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Informations sur les cultures du champs</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "mons", borderRadius: Dims.borderradius, fontSize: Dims.titletextsize, color: Colors.pillColor, padding: 10, backgroundColor: Colors.primaryColor }}>{cultures && cultures['length']}</Text>
                                </View>
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            {cultures.map((v, k) => (
                                <>
                                    <View style={{}} key={Math.random() * i * Math.random()}>
                                        <View style={{ marginBottom: 10 }} key={i * k *  Math.random() * Math.random()}>
                                            <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Culture : { k + 1 }</Text>
                                            <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{v && v['cultures']}</Text>
                                        </View>
                                        <Divider style={{ marginVertical: 8 }} />
                                    </View>
                                </>
                            ))}
                        </View>

                        <View style={{ marginTop: 10, padding: 10, backgroundColor: Colors.pillColor }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Agriculteur</Text>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Informations sur l'agiculteur</Text>
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Nom</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{agr && agr['nom']}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Postnom</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{agr && agr['postnom']}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Prenom</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{agr && agr['prenom'] !== "#" && agr['prenom'] !== "" ? agr['prenom'] : "---"}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Numéro de téléphone</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "capitalize" }}>{agr && agr['phone'] !== "#" ? agr['phone'] : "---"}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize }}>Adresse email</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textTransform: "lowercase" }}>{agr && agr['email'] !== "#" && agr['email'] !== "" ? agr['email'] : "---"}</Text>
                            </View>
                        </View>
                    </View>
                    <Footer/> 
                </ScrollView>
            </View>
            <View style={{ padding: 0, alignSelf: "center", overflow: "hidden", borderTopStartRadius: Dims.borderradius, borderTopEndRadius: Dims.borderradius, backgroundColor: Colors.whiteColor }}>
                <Modal
                    style={{ position: "absolute", bottom: -20, height: 500, overflow: "hidden", backgroundColor: Colors.whiteColor, alignSelf: "center", borderTopStartRadius: Dims.borderradius - 6, borderTopEndRadius: Dims.borderradius - 6 }}
                    isVisible={isvisible}
                    onBackButtonPress={() => { setisVisible(false) }}
                    onBackdropPress={() => { setisVisible(false) }}
                    onDismiss={() => { 
                            setisVisible(false); 
                            // setchoice(false); 
                            setisloading(false); 
                        } 
                    }
                >
                    <View style={[ map, { alignSelf: "center", width: "100%" } ]}>
                        <View style={{ position: "absolute", width: "100%", height: 75, backgroundColor: Colors.pillColor, zIndex: 2992782, top: 0, elevation: 28 }}>
                            <View style={{ flexDirection: "column", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center", height: 75 }}>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.bigtitletextsize - 5 }}>Cultures</Text>
                                <Text style={{ fontFamily: "mons-e" }}>Ajout des cultures pour un champs</Text>
                            </View>
                        </View>
                        <View style={{ width: Dims.width }}>
                            <ScrollView 
                                    contentContainerStyle={{ paddingBottom: "100%", backgroundColor: Colors.whiteColor, marginTop: 60 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View style={{width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
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
                                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                            <TouchableHighlight 
                                                onPress={() => {
                                                    if(selectedItems.length > 0){
                                                        setisloading(true)
                                                        onRunExternalRQST({
                                                            method: "PUT",
                                                            url: `/champs/champ/${item && item['id']}`,
                                                            data: {
                                                                idculture: selectedItems.toString()
                                                            }
                                                        }, (uErr, uDone) => {
                                                            if(uDone && uDone['status'] === 200){
                                                                setisloading(false);
                                                                setisVisible(false);
                                                                Toast.show({
                                                                    type: 'success',
                                                                    text1: 'Mis à jour',
                                                                    text2: 'Les mis à jour des cultures ont réussies !',
                                                                });
                                                            }else{
                                                                setisloading(false)
                                                                Toast.show({
                                                                    type: 'error',
                                                                    text1: 'Erreur',
                                                                    text2: 'Erreur de mis à jour !',
                                                                });
                                                            }
                                                        })
                                                    }else{
                                                        Toast.show({
                                                            type: 'error',
                                                            text1: 'Erreur',
                                                            text2: 'Vous devez séléctionner les cultures',
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
                                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons-b" }}>Confirmer</Text>    
                                                }
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                {/* ------------------- end map ---------------- */}
            </View>
        </View>
    )
}