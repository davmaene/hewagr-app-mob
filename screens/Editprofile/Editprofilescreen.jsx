import * as React from 'react';
import { View, Text, ScrollView, TextInput, TouchableHighlight } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { inputGroup } from '../../assets/styles/Styles';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, Fontisto, FontAwesome, FontAwesome5, MaterialCommunityIcons, Zocial } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { calcMinimumDate } from '../../assets/Helper/Helpers';
import { onRunExternalRQST, onRunRawQRY } from '../../services/communications';
import { RefreshControl } from 'react-native';
import DialogBox from 'react-native-dialogbox';
import Toast from 'react-native-toast-message';
import { Loader } from '../../components/Loader/comp.loader';

export const EditprofileScreen = ({ navigation }) => {

    const user = global && global['user'];
    const [isloading, setisloading] = React.useState(false);
    const [genders, setgeders] = React.useState([]);
    const [nom, setnom] = React.useState(user && user['nom']);
    const [postnom, setpostnom] = React.useState(user && user['postnom']);
    const [prenom, setprenom] = React.useState(user && user['prenom']);
    const [datenaissance, setdatenaissance] = React.useState(user && user['datenaissance']);
    const [email, setemail] = React.useState(user && user['email']);
    const [phone, setphone] = React.useState(user && user['phone']);
    const [adresse, setadresse] = React.useState(user && user['adresse']);
    const [idvillage, setidvillage] = React.useState(user && user['idvillage']);
    const [idvillages, setidvillages] = React.useState([]);
    const [gender, setgender] = React.useState("");
    const [d, setd] = React.useState(datenaissance.substring(0, datenaissance.indexOf("-")));
    const [m, setm] = React.useState(datenaissance.substring(datenaissance.indexOf("-") + 1, datenaissance.lastIndexOf("-")));
    const [y, sety] = React.useState(datenaissance.substring(datenaissance.lastIndexOf("-") + 1));
    const ref = React.useRef();

    const onloadVillages = async () => {
        setisloading(true);
        await onRunExternalRQST({
            method: "GET",
            url: `/villages/liste`
        }, (er, liste) => {
            if(liste && liste['status'] === 200){
                setidvillages(liste && liste['data'] && liste['data']['liste'])
                setisloading(false);
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Les chargement de cooperative à échoché!',
                });
                setisloading(false);
            }
        })
    };

    const onRefreshing = () => {
        onloadVillages()
    };

    const getFullYearFromUnix = ({ unix }) => {
        return new Date(unix * 1000).getFullYear();
    }

    const onSubmit = async () => {
        if(nom.length > 0){
            if(postnom.length > 0){
                if(gender.length > 0){
                    if(d.length > 0 && parseInt(d) <= 31){
                        if(m.length > 0 && parseInt(m) <= 12){
                            const req = getFullYearFromUnix({ unix: calcMinimumDate({ agerequired: 18 }) });
                            if(y.length === 4 &&  parseInt(y) <= req){
                                if(adresse.length > 5){
                                    setisloading(true);
                                    onRunExternalRQST({
                                        method: "PUT",
                                        url: `/ambassadeurs/ambassadeur/${user && user['realid']}`,
                                        data: {
                                            nom,
                                            postnom,
                                            prenom,
                                            genre: gender,
                                            idvillage: idvillage,
                                            email,
                                            datenaissance: `${d}-${m}-${y}`,
                                            adresse
,                                        }
                                    }, (err, done) => {
                                       if(done && done['status'] === 200){
                                         onRunRawQRY({
                                            table: `__tbl_user`,
                                            sql: `update __tbl_user set nom = '${nom}', postnom = '${postnom}', prenom = '${prenom}', datenaissance = '${`${d}-${m}-${y}`}', email = '${email}', adresse = '${adresse}', idvillage = ${idvillage}, genre = '${gender}' where id = ${user && user['id']}`,
                                            options: {}
                                         }, (e, dn) => {
                                            if(dn){
                                                global.user = dn;
                                                setisloading(false);
                                                Toast.show({
                                                    type: 'success',
                                                    text1: `Succès | Mis à jour`,
                                                    text2: `Mis à jour effectuée avec succès !`,
                                                });
                                                ref.current.tip({
                                                    title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Mis à jour du compte</Text>,
                                                    content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vos informations on été mis à jour avec succès </Text>],
                                                    btn: {
                                                        text: `D'accord`,
                                                        style: {
                                                            color: Colors.primaryColor,
                                                            fontFamily: 'mons',
                                                            fontSize: Dims.subtitletextsize
                                                        },
                                                        callback: () => navigation.replace("tabs")
                                                    }
                                                })
                                            }else{
                                                setisloading(false);
                                                Toast.show({
                                                    type: 'error',
                                                    text1: `Erreur`,
                                                    text2: `Une erreur vient de se produire lors de la mis à jour !`,
                                                });
                                            }
                                         })
                                       }else{
                                            setisloading(false);
                                            Toast.show({
                                                type: 'error',
                                                text1: `Erreur`,
                                                text2: `Une erreur vient de se produire lors de la mis à jour !`,
                                            });
                                       }
                                    })
                                }else{
                                    Toast.show({
                                        type: 'error',
                                        text1: `Valeur obligatoire`,
                                        text2: `La valeur de l'adresse entrée est invalide !`,
                                    });
                                }
                            }else{
                                Toast.show({
                                    type: 'error',
                                    text1: `Ceux qui sont nés après ${req} sont non eligibles`,
                                    text2: `Vous devez avoir au minimum 18 Ans`,
                                });
                            }
                        }else{
                            Toast.show({
                                type: 'error',
                                text1: 'Valeur obligatoire',
                                text2: 'La valeur du mois entrée est invalide !',
                            });
                        }
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Valeur obligatoire',
                            text2: 'La valeur du jour entrée est invalide !',
                        });
                    }
                }else{
                    Toast.show({
                        type: 'error',
                        text1: 'Valeur obligatoire',
                        text2: 'Séléctionner le sexe',
                    });
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Valeur obligatoire',
                    text2: 'Ajouter le postnom',
                });
            }
        }else{
            Toast.show({
                type: 'error',
                text1: 'Valeur obligatoire',
                text2: 'Ajouter le nom',
            });
        }
    };

    React.useEffect(() => {
        onRefreshing();
        setgeders(
            [
                {
                    id: 1,
                    value: "Masculin"
                },
                {
                    id: 2,
                    value: "Feminin"
                }
            ]
        )
    }, []);


    return(
        <>
           <Title navigation={navigation} title={"Profile"} subtitle={"Modification profile"} />
           <ScrollView 
                refreshControl={<RefreshControl
                    refreshing={isloading}
                    onRefresh={onRefreshing}
                    colors={[Colors.primaryColor]}
                />}
                contentContainerStyle={{ paddingBottom: "auto", backgroundColor: Colors.primaryColor }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor,  marginTop: Dims.smallradius, paddingBottom: 100 }}>
                    <View style={{width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 0}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nom <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <TextInput 
                                        value={nom}
                                        onChangeText={t => setnom(t)}
                                        placeholder='Nom' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, {  }]}>
                                    <FontAwesome name="user" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* ------------------------ */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Postnom <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <TextInput
                                        value={postnom}
                                        onChangeText={t => setpostnom(t)} 
                                        placeholder='Postnom' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <FontAwesome name="user" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* -------------------------- */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Prenom </Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <TextInput 
                                        value={prenom}
                                        onChangeText={t => setprenom(t)}
                                        placeholder='Prenom ...' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <FontAwesome name="user" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* -------------------------- */}
                        {/* <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Numéro de téléphone <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <TextInput 
                                        value={phone}
                                        onChangeText={t => setphone(t)}
                                        placeholder='Numéro de téléphone' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { backgroundColor: Colors.primaryColor }]}>
                                    <Entypo name="phone" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                </View>
                            </View>
                        </View> */}
                        {/* -------------------------- */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse email <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <TextInput 
                                        value={email}
                                        onChangeText={t => setemail(t)}
                                        placeholder='Numéro de téléphone' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <MaterialCommunityIcons name="email" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* -------------------------- */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Genre <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <Dropdown
                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                        containerStyle={{}}
                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                        data={genders}
                                        maxHeight={ 200 }
                                        labelField="value"
                                        valueField="id"
                                        placeholder={'Séléctionner le genre'}
                                        onChange={item => {
                                            setgender(item.value);
                                        }}
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <MaterialCommunityIcons name="gender-male-female" size={Dims.iconsize} color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* -------------------------- */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Date de naissance Jour | Mois | Année <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={[ inputGroup.container, { borderWidth: 0, height: Dims.inputTextHeight + 2, justifyContent: "center", overflow: "visible", paddingVertical: 0 }]}>
                                <View style={[ inputGroup.inputcontainer, { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 2 }]}>
                                    <View style={[ inputGroup.container , { width: "32%", backgroundColor: Colors.pillColor, alignContent: "center", alignItems: "center", height: "100%", justifyContent: "center" }]}>
                                        <TextInput 
                                            value={d}
                                            onChangeText={t => setd(t)}
                                            keyboardType={"numeric"}
                                            maxLength={2}
                                            placeholder='1' 
                                            style={{ backgroundColor: Colors.pillColor, textAlign: "center", height: "100%", width: "100%", paddingHorizontal: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                        />
                                    </View>
                                    <View style={[ inputGroup.container , { width: "32%", backgroundColor: Colors.pillColor, alignContent: "center", alignItems: "center", height: "100%", justifyContent: "center" }]}>
                                        <TextInput 
                                            value={m}
                                            maxLength={2}
                                            keyboardType={"numeric"}
                                            onChangeText={t => setm(t)}
                                            placeholder='12' 
                                            style={{ backgroundColor: Colors.pillColor, textAlign: "center", height: "100%", width: "100%", paddingHorizontal: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                        />
                                    </View>
                                    <View style={[ inputGroup.container , { width: "32%", backgroundColor: Colors.pillColor, alignContent: "center", alignItems: "center", height: "100%", justifyContent: "center" }]}>
                                        <TextInput 
                                            value={y}
                                            onChangeText={t => sety(t)}
                                            placeholder='2000' 
                                            maxLength={4}
                                            keyboardType='numeric'
                                            style={{ backgroundColor: Colors.pillColor, textAlign: "center", height: "100%", width: "100%", paddingHorizontal: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                        />
                                    </View>
                                </View>
                                <View style={[ inputGroup.iconcontainer, { borderBottomRightRadius: Dims.borderradius, borderTopRightRadius: Dims.borderradius }]}>
                                    <MaterialIcons name="date-range" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* -------------------------- */}
                        {/* <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Village </Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <Dropdown
                                        style={[{ width: "100%", paddingRight: 15, marginTop: 0, height: "100%", backgroundColor: Colors.pillColor }]}
                                        placeholderStyle={{ color: Colors.placeHolderColor, fontFamily: "mons", fontSize: Dims.iputtextsize, paddingLeft: 25 }}
                                        containerStyle={{}}
                                        selectedTextStyle={{ color: Colors.primaryColor, fontFamily: "mons", paddingLeft: 25, fontSize: Dims.iputtextsize }}
                                        inputSearchStyle={{ backgroundColor: Colors.pillColor, height: 45, width: "95%", paddingLeft: 5, fontFamily: "mons", fontSize: Dims.iputtextsize }}
                                        data={idvillages}
                                        search
                                        maxHeight={ 200 }
                                        labelField="village"
                                        valueField="id"
                                        placeholder={'Séléctionner un village'}
                                        searchPlaceholder="Recherche ..."
                                        onChange={item => {
                                            setidvillage(item.village);
                                        }}
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, {  }]}>
                                    <FontAwesome5 name="map-marker" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View> */}
                        {/* -------------------------- */}
                        <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Adresse <Text style={{color: Colors.dangerColor}}>*</Text></Text>
                            <View style={ inputGroup.container }>
                                <View style={ inputGroup.inputcontainer }>
                                    <TextInput 
                                        multiline
                                        value={adresse}
                                        onChangeText={t => setadresse(t)}
                                        placeholder='Adresse ...' 
                                        style={{ backgroundColor: Colors.pillColor, height: "100%", width: "100%", paddingLeft: 25, fontFamily: "mons", fontSize: Dims.iputtextsize }} 
                                    />
                                </View>
                                <View style={[ inputGroup.iconcontainer, { }]}>
                                    <FontAwesome name="map-o" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                </View>
                            </View>
                        </View>
                        {/* -------------------------- */}
                        <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                            <TouchableHighlight 
                                onPress={onSubmit}
                                underlayColor={ Colors.primaryColor }
                                style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                            >
                                {isloading ? <Loader color={Colors.whiteColor} /> : <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Enregistrer les modifications</Text>}
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <Footer/>
            </ScrollView>
            <DialogBox ref={ref} isOverlayClickClose={false} />
        </>
    )
}