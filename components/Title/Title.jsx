import * as React from 'react';
import { Appbar,  Button, Divider, Provider } from 'react-native-paper';
import { Platform, Text, View } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import NetInfos from '@react-native-community/netinfo';

export const Title = ({ title, subtitle, action, navigation, menucomponent }) => {

    const [visible, setVisible] = React.useState(false);
    const ref = React.useRef();
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    const [on, setison] = React.useState(true);
    const iscollecteur = global.iscollecteur;

    React.useEffect(() => {

        // const unsubsribe = NetInfos.addEventListener(onc => {
        //     if(onc.isConnected) setison(true);
        //     else setison(false);
        // });

        // unsubsribe();
        
    }, []);

    return(

        <>
            {!on && 
                (
                    <View style={{ width: "100%", height: "auto", paddingVertical: 4, backgroundColor: Colors.dangerColor, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="ios-cloud-offline-sharp" size={Dims.iconsize - 3} color={Colors.darkColor} />
                            <Text style={{ fontFamily: "mons-b", paddingLeft: 10, fontSize: Dims.subtitletextsize - 2, color: Colors.darkColor }}>Mode hors connexion activé</Text>
                        </View>
                    </View>
                )
            }
            <Appbar.Header
                style={{backgroundColor: Colors.primaryColor}}
            >
                {navigation 
                ?
                    <Appbar.Action 
                        color={ Colors.whiteColor }
                        icon="arrow-left-circle" 
                        onPress={() => 
                            {
                                if(typeof action === "function") action();
                                else navigation.goBack();
                            }
                        } 
                    />
                : 
                    <></>
                }

                <Appbar.Content 
                    title={<Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, color: Colors.whiteColor, textTransform: "uppercase" }}>{title}</Text>} 
                    subtitle={<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, color: Colors.whiteColor }}>{subtitle}</Text>} 
                />
                <Menu
                    visible={visible}
                    anchor={
                        <Ionicons 
                            name='ellipsis-vertical' 
                            style={{ padding: 12 }} 
                            size={ Dims.iconsize } color={ Colors.whiteColor } 
                            onPress={showMenu}
                        />
                    }
                    onRequestClose={hideMenu}
                >
                    <MenuItem 
                        onPress={() => {
                            hideMenu()
                            navigation.navigate("Home")
                        }}
                    >
                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                            <AntDesign name='home' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                            <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Acceuil</Text>
                        </View>
                    </MenuItem>
                    <MenuDivider />
                    {iscollecteur === 0 && 
                        (
                            <MenuItem 
                                onPress={() => {
                                    hideMenu()
                                    navigation.navigate('addcultivateur')
                                }}>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <AntDesign name='adduser' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                                    <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Nouvel agriculteur</Text>
                                </View>
                            </MenuItem>
                        )
                    }

                    {iscollecteur === 0 && 
                        (
                            <MenuItem 
                                onPress={() => {
                                    hideMenu()
                                    navigation.navigate("addchamps")
                                }}
                            >
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <MaterialIcons name='leak-add' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                                    <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Nouveau champ</Text>
                                </View>
                            </MenuItem>
                        )
                    }

                    {iscollecteur === 0 && 
                        (
                            <MenuItem 
                                onPress={() => {
                                    hideMenu()
                                    navigation.navigate('souscription')
                                }}>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <AntDesign name='plus' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                                    <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Ab. météo</Text>
                                </View>
                            </MenuItem>
                        )
                    }

                    {iscollecteur === 0 && 
                        (
                            <MenuItem 
                                onPress={() => {
                                    hideMenu()
                                    navigation.navigate('abonnement')
                                }}>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <AntDesign name='plus' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                                    <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Ab. prix du marché</Text>
                                </View>
                            </MenuItem>
                        )
                    }

                    <MenuItem 
                        onPress={() => {
                            hideMenu()
                            navigation.navigate('conseil')
                        }}>
                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                            <AntDesign name='plus' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                            <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Ab. conseils agricoles</Text>
                        </View>
                    </MenuItem>

                    {iscollecteur === 1 && 
                        (
                            <MenuItem 
                                onPress={() => {
                                    hideMenu()
                                    navigation.navigate('collect')
                                }}>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                                    <AntDesign name='plus' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                                    <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Nouvelle collection</Text>
                                </View>
                            </MenuItem>
                        )
                    }

                    <MenuDivider />
                    <MenuItem 
                        onPress={() => {
                            hideMenu()
                            navigation.navigate("profile")
                        }}
                    >
                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                            <AntDesign name='user' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                            <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Profile</Text>
                        </View>
                    </MenuItem>

                    {/* <MenuItem onPress={hideMenu}>
                        <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center" }}>
                            <AntDesign name='logout' style={{ color: Colors.darkColor, paddingHorizontal: 2 }} />
                            <Text style={{ marginHorizontal: 5, fontSize: Dims.subtitletextsize, fontFamily: "mons-e" }}>Déconnexion</Text>
                        </View>
                    </MenuItem> */}
                </Menu>
            </Appbar.Header>
        </>
    )
};