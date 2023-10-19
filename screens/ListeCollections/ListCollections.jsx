import * as React from 'react';
import { View, FlatList, Text, TextInput } from 'react-native';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Avatar, Divider, ListItem } from 'react-native-elements'
import { Feather, FontAwesome5, Entypo, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../assets/colors/Colors';
import { returnInitialOfNames } from '../../assets/Helper/Helpers';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { TouchableHighlight } from 'react-native';
import { RefreshControl } from 'react-native';
import { inputGroup } from '../../assets/styles/Styles';
import { appcompanyname, appname } from '../../assets/configs/configs';

export const ListeCollectionScreen = ({ navigation, route}) => {
    
    const item = route && route['params'] && route['params']['liste'];
    const liste = item;
    const [isloading, setisloading] = React.useState(false);
    const [temp, settemp] = React.useState(item);

    const handleSearch = async (text) => {
        if(1 && liste.length && text.length > 0 && text !== "" && text !== " "){
            const filteredRows = liste.filter((row) => {
                return ( 
                    row.zone.toLowerCase().includes(text.toLowerCase()) || 
                    row.categorie.toLowerCase().includes(text.toLowerCase()) || 
                    row.marche.toLowerCase().includes(text.toLowerCase()) || 
                    row.produit.toLowerCase().includes(text.toLowerCase()) )  
                    ? row 
                    : null;
            });
            settemp(filteredRows);
        }else settemp(liste);
    }

    const renderItem = ({ item }) => {
        const color = Colors.primaryColor; // randomColor() ||
        console.log(" Message informations => ", item);
        return (
            <TouchableHighlight
                underlayColor={ Colors.pillColor }
                style={{ paddingHorizontal: 3, paddingVertical: 10, alignSelf: "center", marginTop: 5, width: "100%", borderRadius: 10 }}
                onPress={() => navigation.navigate("collection", { item })}
            >
                <View style={{ borderColor: Colors.primaryColor, borderWidth: .4, padding: 10, borderRadius: 10, elevation: 2, backgroundColor: Colors.whiteColor }}>
                    <View style={{ position: "absolute", top: -10, padding: 2, marginLeft: Dims.iconsize }}>
                        <FontAwesome name="bookmark" size={Dims.iconsize} color={Colors.primaryColor} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                    <View style={{ padding: 2 }}>
                        <Text style={{ fontFamily: "mons-e", paddingBottom: 5 }}>Commentaire</Text>
                        <Text style={{ fontFamily: "mons-b", color: Colors.darkColor }}>{item && item['description'] ? item['description'] : "---"}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    React.useEffect(() => {

    }, [])

    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
            <Title title={"Mes collections"} subtitle={"Liste des collections"} navigation={navigation} />
            <View style={{ paddingHorizontal: 10, backgroundColor: Colors.whiteColor, marginTop: 10 }}>
                <View>
                    <View style={{width: "100%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: 0}}>
                        <View style={[ inputGroup.container, { flexDirection: "row", backgroundColor: Colors.pillColor }]}>
                            <TouchableHighlight
                                underlayColor={Colors.whiteColor}
                                style={[ inputGroup.iconcontainer, { backgroundColor: Colors.pillColor }]}
                            >
                                <Ionicons name={"md-search"} size={ Dims.iconsize } color={ Colors.primaryColor } />
                            </TouchableHighlight>
                            <View style={[ inputGroup.inputcontainer, { width: "80%", paddingRight: 20, paddingLeft: 0 } ]}>
                                <TextInput 
                                    placeholder="Produit | Marché | Catégorie"
                                    enablesReturnKeyAutomatically 
                                    onChangeText={ handleSearch } 
                                    style={[ inputGroup.input, { fontFamily: "mons", paddingLeft: 20 } ]} 
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: "50%" }}
                    refreshControl={<RefreshControl 
                        refreshing={isloading}
                        onRefresh={ () => {} }
                        colors={[Colors.primaryColor]}
                    />}
                    keyExtractor={(item) => item.id.toString()}
                    data={temp}
                    renderItem={renderItem}
                    ListEmptyComponent={<EmptyList/>}
                    ListFooterComponent={(
                        <View style={{ bottom: "0%", marginTop: 10, width: "100%", backgroundColor: Colors.whiteColor, paddingVertical: 10, alignItems: "center", alignSelf: "center"}}>
                            <Text style={{ fontFamily: "mons-b", fontSize: 10, textAlign: "center" }}>&copy; {appname} {new Date().getFullYear()} | by {appcompanyname}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}