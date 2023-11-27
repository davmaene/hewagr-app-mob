import * as React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Avatar, Divider } from 'react-native-elements';
import { Feather, FontAwesome5, Entypo, Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { ScrollView } from 'react-native';
import { replaceString } from '../../assets/Helper/Helpers';
import { onRunExternalRQST } from '../../services/communications';

export const DetailsCollectionScreen = ({ navigation, route }) => {

    const item = route && route['params'] && route['params']['item'];
    const color = Colors.primaryColor;// 
    const user = global && global['user'];
    const [isloading, setisloading] = React.useState(false)
    const [extras, setextras] = React.useState({})

    const { __tbl_culture, __tbl_unite_mesure, __tbl_user, commentaire, devise, id, prix_max, prix_min } = item;

    const onRefresh = () => {
        setisloading(true)
        onRunExternalRQST({
            url: `/infos-marches/marches/user/${user && user['realid']}`,
            method: "GET"
        }, (err, done) => {
            setisloading(false)
            if (done) {
                // console.log(done);
                setextras(done && done['data'])
            } else {
                setextras({})
            }
        })
    };

    React.useEffect(() => {
        onRefresh()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <Title title={`Collection`} subtitle={"Détail d'une collection"} navigation={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: "50%" }}
            >
                <View style={{ marginHorizontal: 5 }}>
                    <View style={
                        {
                            padding: 10,
                            borderRadius: 10,
                            backgroundColor: Colors.whiteColor,
                            marginTop: (Dims.iconsize * 2),
                            borderTopColor: Colors.primaryColor,
                            borderTopWidth: .5
                        }
                    }>
                        <View style={{ position: "absolute", top: - (Dims.iconsize / 1), padding: 2, marginLeft: 10 }}>
                            <FontAwesome name="bookmark" size={Dims.iconsize * 2} color={Colors.primaryColor} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: Dims.iconsize }}>
                            <View style={{ width: "25%", alignContent: "flex-start", alignItems: "flex-start", padding: 2, paddingVertical: 10, }}>
                                <Text style={{ fontFamily: "mons-e", textAlign: "left" }}>Catégorie</Text>
                                <Text style={{ fontFamily: "mons-b", textAlign: "left", fontSize: Dims.subtitletextsize, color: Colors.primaryColor }}>{item && item['categorie']}</Text>
                            </View>
                            <View style={{ width: "25%", alignContent: "center", alignItems: "center", padding: 2, paddingVertical: 10, }}>
                                <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Marché</Text>
                                <Text style={{ fontFamily: "mons-b", textAlign: "center", fontSize: Dims.subtitletextsize, color: Colors.primaryColor }}>{extras && extras['__tbl_march'] ? extras['__tbl_march']['name'] : "---"}</Text>
                            </View>
                            <View style={{ width: "50%", alignContent: "center", alignItems: "center", backgroundColor: Colors.pillColor, padding: 2, paddingVertical: 10, borderRightColor: Colors.primaryColor, borderRightWidth: 4 }}>
                                <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Produit</Text>
                                <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", textAlign: "center", fontSize: Dims.subtitletextsize, color: Colors.primaryColor }}>{__tbl_culture && __tbl_culture['cultures']}</Text>
                            </View>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Date de collecte</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.darkColor }}>{item && item['created_at'] ? item['created_at'] : "---"}</Text>
                        </View>
                        <View style={{ padding: 2, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Commentaire</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.darkColor }}>{item && item['commentaire'] ? item['commentaire'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Produit</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{__tbl_culture && __tbl_culture['cultures'] ? __tbl_culture['cultures'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Unité locale</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{__tbl_unite_mesure && __tbl_unite_mesure['name'] ? __tbl_unite_mesure['name'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Valeur en kilogramme <Text style={{ fontFamily: "mons" }}>kg</Text></Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{__tbl_unite_mesure && __tbl_unite_mesure['valeur_kg'] ? `${__tbl_unite_mesure['valeur_kg']}KG` : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Prix en détail</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.secondaryColor }}>{prix_min && prix_min ? prix_min : "---"}<Text>{devise && devise ? devise : "---"}</Text></Text>
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Prix en gros</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.secondaryColor }}>{prix_max && prix_max ? prix_max : "---"}<Text>{devise && devise ? devise : "---"}</Text></Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Zône de production</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{item && item['zone'] ? item['zone'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Marché</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{extras && extras['__tbl_march'] ? extras['__tbl_march']['name'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 10, backgroundColor: Colors.primaryColor, borderRadius: 5 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5, color: Colors.whiteColor }}>Jour du marché</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.whiteColor }}>{extras && extras['__tbl_march'] && extras['__tbl_march']['jours_marches'] ? replaceString({ string: extras['__tbl_march']['jours_marches'], replaceWith: "   |  ", tag: /,/g }) : "---"}</Text>
                        </View>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </View>
    )
}