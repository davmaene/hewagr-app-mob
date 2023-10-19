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

export const DetailsCollectionScreen = ({ navigation, route }) => {

    const item = route && route['params'] && route['params']['item'];
    const color = Colors.primaryColor;// 

    const onRefresh = () => {

    };

    React.useEffect(() => {
    }, [])

    return(
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <Title title={`${item && item['categorie']}  >  ${item && item['produit']}`} subtitle={"Détail d'une collection"} navigation={navigation} /> 
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
                        <View style={{ position: "absolute", top: - ( Dims.iconsize / 1 ), padding: 2, marginLeft: 10 }}>
                            <FontAwesome name="bookmark" size={Dims.iconsize * 2} color={Colors.primaryColor} />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: Dims.iconsize }}>
                            <View style={{ width: "25%",  alignContent: "flex-start", alignItems: "flex-start", padding: 2, paddingVertical: 10, }}>
                                <Text style={{ fontFamily: "mons-e", textAlign: "left" }}>Catégorie</Text>
                                <Text style={{ fontFamily: "mons-b",textAlign: "left", fontSize: Dims.subtitletextsize, color: Colors.primaryColor }}>{item && item['categorie']}</Text>
                            </View>
                            <View style={{ width: "25%",  alignContent: "center", alignItems: "center", padding: 2, paddingVertical: 10, }}>
                                <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Marché</Text>
                                <Text style={{ fontFamily: "mons-b", textAlign: "center", fontSize: Dims.subtitletextsize, color: Colors.primaryColor }}>{item && item['marche']}</Text>
                            </View>
                            <View style={{ width: "25%", alignContent: "center", alignItems: "center", padding: 2, paddingVertical: 10 }}>
                                <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Zône</Text>
                                <Text style={{ fontFamily: "mons-b", textAlign: "center", fontSize: Dims.subtitletextsize, color: Colors.primaryColor }}>{item && item['zone']}</Text>
                            </View>
                            <View style={{ width: "25%", alignContent: "center", alignItems: "center", backgroundColor: Colors.pillColor, padding: 2, paddingVertical: 10, borderRightColor: Colors.primaryColor, borderRightWidth: 4 }}>
                                <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Produit</Text>
                                <Text style={{ fontFamily: "mons-b", textTransform: "uppercase", textAlign: "center", fontSize: Dims.subtitletextsize, color: Colors.primaryColor }}>{item && item['produit']}</Text>
                            </View>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Date de collecte</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.darkColor }}>{item && item['createAt'] ? item['createAt'] : "---"}</Text>
                        </View>
                        <View style={{ padding: 2, marginBottom: 20  }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Commentaire</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.darkColor }}>{item && item['description'] ? item['description'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Produit</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{item && item['produit'] ? item['produit'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Unité locale</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{item && item['unites'] ? item['unites'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Valeur en kilogramme <Text style={{ fontFamily: "mons" }}>kg</Text></Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{item && item['valeur_kg'] ? item['valeur_kg'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 2 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Prix</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.secondaryColor }}>{item && item['prix'] ? item['prix'] : "---"}<Text>{item && item['devise'] ? item['devise'] : "---"}</Text></Text>
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
                            <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{item && item['marche'] ? item['marche'] : "---"}</Text>
                        </View>
                        <View style={{ marginVertical: 5 }}>
                            <Divider style={{ backgroundColor: color }} />
                        </View>
                        <View style={{ padding: 10, backgroundColor: Colors.primaryColor, borderRadius: 5 }}>
                            <Text style={{ fontFamily: "mons-e", paddingBottom: 5, color: Colors.whiteColor }}>Jour du marché</Text>
                            <Text style={{ fontFamily: "mons-b", color: Colors.whiteColor }}>{item && item['jour_marche'] ? replaceString({ string: item['jour_marche'], replaceWith: "   |  ", tag: /,/g }) : "---"}</Text>
                        </View>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </View>
    )
}