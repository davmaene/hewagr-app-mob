import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { View, Text, TouchableHighlight, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Colors } from '../../assets/colors/Colors';
import { AntDesign, Entypo, Ionicons, Feather, MaterialIcons, Fontisto, FontAwesome, FontAwesome5, MaterialCommunityIcons, Zocial, Octicons } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import DialogBox from 'react-native-dialogbox';
import Toast from 'react-native-toast-message';
import { onDeconnextion } from '../../services/communications';
import * as Linking  from 'expo-linking';
import { appname } from '../../assets/configs/configs';
import { emailValidator, returnInitialOfNames } from '../../assets/Helper/Helpers';
import RNRestart from 'react-native-restart';
import GLOBALP from '../../components/GlobalHookAndStateProfile/GlobalHookAndStateProfile';
import { SpeedDialProfileCustomer } from '../../components/SpeedDialProfile/SpeedDialProfileComponent';

export const ProfileScreen = ({ navigation }) => {

    const user = global && global['user'];
    if(user && !emailValidator({ email: user['email'] })) user['email'] = "#"
    const type = global && global['type'];
    const ref = React.useRef();
    const [showmore, setshowmore] = React.useState(true);
    const iscollecteur = global.iscollecteur;
    const [init, setInit] = React.useState(global && global.iscollecteur === 1 ? 1 : 0);

    const handlDeconnexion = () => {
        ref.current.confirm({
            title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Déconnexion compte</Text>,
            content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Vous êtes sur le point de vouloir vous déconnecter de se téléphone voulez-vous vraiement continuer </Text>],
            ok: {
                text: 'Continuer',
                style: {
                    color: Colors.primaryColor,
                    fontFamily: 'mons'
                },
                callback: () => {
                    try {
                        onDeconnextion((err, done) => {
                            if(done){
                                Toast.show({
                                    type: 'success',
                                    text1: 'Déconnexion',
                                    text2: 'Vos informations sont supprimées avec succès !',
                                });
                                RNRestart.Restart()
                            }else{
                                console.log("error => ", err);
                                Toast.show({
                                    type: 'error',
                                    text1: 'Déconnexion',
                                    text2: 'Une erreur vient de se produire lors de la déconnexion !'
                                });
                            }
                        })
                    } catch (error) {
                        Toast.show({
                            type: 'error',
                            text1: 'Déconnexion',
                            text2: 'Une erreur vient de se produire lors de la déconnexion !'
                        });
                        console.log(error);
                    }
                }
            },
            cancel: {
                text: 'Annuler',
                style: {
                    color: Colors.darkColor,
                    fontFamily: "mons-e"
                }
            },
        });
    };

    React.useEffect(() => {

        GLOBALP.ScreenGlobalProfile.setState({
            navigation: navigation
        })

    }, []);

    return(
        <>
            <View style={{ flexDirection: "row", paddingTop: 10, backgroundColor: Colors.primaryColor, paddingHorizontal: 12, alignContent: "center", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 }}>
                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, paddingLeft: 10, color: Colors.whiteColor }}>Profile </Text>
                <TouchableHighlight
                    style={{ padding: 5, flexDirection: "row", alignContent: "center", alignItems: "center" }}
                    onPress={() => {
                            if(init === 1){
                                Toast.show({
                                    type: 'info',
                                    text1: 'Profile',
                                    text2: 'Non disponible pour le moment !',
                                });
                            }else navigation.navigate("edit-profile");
                        } 
                    }
                    underlayColor={"transparent"}
                >
                    <>
                        <AntDesign name="edit" size={Dims.iconsize} color={Colors.pillColor} />
                    </>
                </TouchableHighlight>
            </View>
            <LinearGradient
                colors={[Colors.primaryColor, Colors.primaryColor]}
                style={{ width: "100%", height: "auto", paddingBottom: 20,  flexDirection: "row", alignContent: "center", alignItems: "center", paddingTop: 10 }}
            >
                {user && user['id'] && (
                    <View style={{ width: "100%", alignContent: "center", alignItems: "center", flexDirection: "column", paddingHorizontal: 20 }}>
                        <Avatar 
                            rounded 
                            title={<Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.primaryColor }}>{returnInitialOfNames({ fsname: user && user['nom'], lsname: user && user['postnom'] })}</Text>} 
                            size={60}
                            containerStyle={{ backgroundColor: Colors.pillColor, borderColor: Colors.primaryColor }}
                        />
                        <View style={{ marginTop: 10, alignContent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily: "mons-b", fontSize: Dims.titletextsize, textTransform: "uppercase", color: Colors.pillColor }}>{user && user['nom']} {user && user['postnom']}</Text>
                            <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                <Zocial name="call" size={ Dims.iconsize - 5 } color={ Colors.whiteColor } />
                                <Text style={{ fontFamily: "mons", color: Colors.pillColor, fontSize: Dims.subtitletextsize, paddingHorizontal: 5, textAlign: "center" }}>
                                    { user && user['phone'] }
                                </Text>
                            </View>
                            { showmore && 
                                (
                                    <View>

                                        { user && user['email'] && emailValidator({ email: user && user['email'] }) &&
                                            (
                                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                                    <MaterialIcons name="email" size={ Dims.iconsize - 5 } color={ Colors.whiteColor } />
                                                    <Text style={{ fontFamily: "mons", color: Colors.pillColor, fontSize: Dims.subtitletextsize - 2, paddingHorizontal: 5, textAlign: "center" }}>
                                                        { user && user['email'] && emailValidator({ email: user && user['email'] }) ? user['email'] : "---" }
                                                    </Text>
                                                </View>
                                            )
                                        }

                                        { user && user['datenaissance'] && ( user['datenaissance'] !== null && user['datenaissance'] !== 'null' ) && 
                                            (
                                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                                    <MaterialIcons name="date-range" size={ Dims.iconsize - 5 } color={ Colors.whiteColor } />
                                                    <Text style={{ fontFamily: "mons", color: Colors.pillColor, fontSize: Dims.subtitletextsize - 2, paddingHorizontal: 5, textAlign: "center" }}>
                                                        { user && user['datenaissance'] }
                                                    </Text>
                                                </View>
                                            )
                                        }
                                        
                                        { user && user['genre'] && ( user['genre'] !== null && user['genre'] !== 'null' ) &&
                                            (
                                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                                    <Octicons name="dot-fill" size={ Dims.iconsize - 5 } color={ Colors.whiteColor } />
                                                    <Text style={{ fontFamily: "mons", color: Colors.pillColor, fontSize: Dims.subtitletextsize - 2, paddingHorizontal: 5, textAlign: "center" }}>
                                                        { user && user['genre'] }
                                                    </Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                )
                            }

                            <View style={{ marginTop: 0 }}>
                                <TouchableHighlight
                                    style={{ padding: 10 }}
                                    underlayColor={Colors.primaryColor}
                                    onPress={() => setshowmore(!showmore)}
                                >
                                    <Feather name={showmore ? "arrow-up-circle" : "arrow-down-circle"} size={Dims.iconsize} color={Colors.whiteColor} />
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                )}
                {type && type === 2 && (
                    <View style={{ alignSelf: "center", width: "100%" }}>
                        <Text style={{ fontFamily: "mons", color: Colors.whiteColor, fontSize: Dims.bigtitletextsize, alignSelf: "center" }}>Type Compte | Supporteur</Text>
                        <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, alignSelf: "center", color: Colors.pillColor }}>Vous êtes connecté entant que supporteur</Text>
                    </View>
                )}
            </LinearGradient>
            <ScrollView 
                style={{ paddingHorizontal: 10, backgroundColor: Colors.pillColor }}
                contentContainerStyle={{ paddingBottom: "50%" }}
                showsVerticalScrollIndicator={ false }
                showsHorizontalScrollIndicator={ false }
            >
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Compte</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Personalisation de mon compte | Modification</Text>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" } }
                            underlayColor={"transparent"}
                            onPress={ () => {
                                    if(init === 1){
                                        Toast.show({
                                            type: 'info',
                                            text1: 'Profile',
                                            text2: 'Non disponible pour le moment !',
                                        });
                                    }else navigation.navigate("edit-profile");
                                } 
                            }
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                    <MaterialIcons name="edit" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Modifier les informations de mon compte </Text>
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
                {/* ------------------------------------------------ */}
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Synchronisation</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Synchronisation des information sauvegardées localement</Text>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" } }
                            underlayColor={"transparent"}
                            onPress={ () => { navigation.navigate("sync", { item: user }) }}
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.dangerColor }}>
                                    <MaterialIcons name="sync" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Synchronisation des informations</Text>
                                </View>
                                <View>
                                    <Text>&nbsp;</Text>
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
                {/* ------------------------------------------------ */}
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>utilisation</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Manuelle d'utilisation | A propos de {appname} | Condition d'utilisation</Text>
                    </View>
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            underlayColor={"transparent"}
                            onPress={() => navigation.navigate("about")}
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <AntDesign name="infocirlce" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>A propos de {appname} </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            underlayColor={Colors.whiteColor}
                            onPress={() => {
                                Linking.openURL("https://manuel.kivugreen.cd")
                            }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.pillColor }}>
                                        <MaterialIcons name="file-copy" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Manuelle d'utilisation</Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.darkColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            underlayColor={Colors.whiteColor}
                            onPress={() => {
                                Linking.openURL("https://www.freeprivacypolicy.com/live/0bfc9c62-13ed-430a-8e44-dd3d8556f5ad")
                            }}
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.pillColor }}>
                                        <MaterialIcons name="privacy-tip" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Conditions d'utilisation </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.darkColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center"}}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <FontAwesome name="universal-access" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Signaler un compte </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                </View>
                {/* ------------------------------------------------ */}
                <View style={{ marginTop: 30 }}>
                    <View style={{ padding: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", color: Colors.darkColor }}>Paramètres</Text>
                        <Text style={{ fontFamily: "mons-e", textTransform: "lowercase", color: Colors.darkColor, fontSize: Dims.subtitletextsize }}>Personalisation de mon compte | les autorisation</Text>
                    </View>
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            underlayColor={"transparent"}
                            onPress={ () => Linking.openSettings() }
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <FontAwesome5 name="map-marker-alt" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Géolocalisation et Map </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            underlayColor={"transparent"}
                            onPress={ () => Linking.openSettings() }
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: 'center', alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <MaterialIcons name="notifications" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Push notifications </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ---------------------------------------------- */}
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor, display: iscollecteur === 0 ? "flex" : "none" }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"  }}
                            underlayColor={Colors.whiteColor}
                            onPress={() => { navigation.navigate("settings") }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.pillColor }}>
                                        <Entypo name="tools" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Configurations </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                    {/* <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"  }}
                        >
                            <>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <View style={{ padding: 8, backgroundColor: Colors.primaryColor }}>
                                        <Fontisto name="world" size={ Dims.iconsize } color={ Colors.whiteColor } />
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Langage </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <AntDesign name="doubleright" size={Dims.iconsize - 8} color={Colors.primaryColor} />
                                </View>
                            </>
                        </TouchableHighlight>
                    </View> */}
                    {/* ------------------------------------------------ */}
                    <View style={{ padding: 5, marginTop: 4, backgroundColor: Colors.whiteColor }}>
                        <TouchableHighlight
                            style={{ flexDirection: "row", alignItems: "center" }}
                            underlayColor={"transparent"}
                            onPress={handlDeconnexion}
                        >
                            <>
                                <View style={{ padding: 8, backgroundColor: Colors.inactiveColor }}>
                                    <AntDesign name="logout" size={Dims.iconsize} color={Colors.pillColor} />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize }}>Déconnexion</Text>
                                </View>
                                <View>
                                    <Text>&nbsp;</Text>
                                </View>
                            </>
                        </TouchableHighlight>
                    </View>
                    {/* ---------------------------------------------- */}
                </View>
            </ScrollView>
            {/* < */}
            <DialogBox ref={ref} isOverlayClickClose={true} />
            <SpeedDialProfileCustomer />
        </>
    )
}