import * as React from 'react';
import { View, FlatList, Text, TextInput } from 'react-native';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Avatar, Divider, ListItem } from 'react-native-elements'
import { Feather, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../assets/colors/Colors';
import { returnInitialOfNames } from '../../assets/Helper/Helpers';
import randomColor from 'randomcolor';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { TouchableHighlight } from 'react-native';
import { RefreshControl } from 'react-native';
import { inputGroup } from '../../assets/styles/Styles';

export const ListeAgriculteurScreen = ({ navigation, route}) => {
    
    const item = route && route['params'] && route['params']['liste'];
    const liste = item && item['liste'];
    const length = item && item['length'];
    const [isloading, setisloading] = React.useState(false);
    const [temp, settemp] = React.useState(liste);

    const handleSearch = async (text) => {
        if(1 && liste.length && text.length > 0 && text !== "" && text !== " "){
            const filteredRows = liste.filter((row) => {
                return row.nom.toLowerCase().includes(text.toLowerCase()) ? row : null;
            });
            settemp(filteredRows);
        }else settemp(liste);
    }

    const renderItem = ({ item }) => {
        const color = Colors.primaryColor; // randomColor() ||
        return (
            <TouchableHighlight
                underlayColor={ Colors.pillColor }
                style={{ paddingHorizontal: 10, paddingVertical: 10, paddingRight: 10 }}
                onPress={() => navigation.navigate("agriculteur", { item })}
            >
                <View style={{ }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View>
                                <Avatar
                                    // rounded
                                    title={<Text style={{ textTransform: "uppercase", fontFamily: "mons-b", fontSize: Dims.titletextsize }}>{returnInitialOfNames({ fsname: item && item['nom'], lsname: item && item['postnom'] })}</Text>}
                                    containerStyle={{ backgroundColor: color, borderRadius: Dims.borderradius }}
                                    size="medium"
                                    key={item && item['id']}
                                />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: "mons", textTransform: "capitalize" }}>{item && item['nom']} {item && item['postnom']}</Text>
                                <Text style={{ fontFamily: "mons-e" }}>{item && item['phone']}</Text>
                                <Text style={{ fontFamily: "mons-e" }}>{item && item['email'] ? item['email'] : "---"}</Text>
                            </View>
                        </View>
                        <View>
                            <Feather name="chevron-right" size={Dims.iconsize} color={ color } />
                        </View>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Divider style={{ backgroundColor: color }} />
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    return (
        <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
            <Title title={"Agriculteurs"} subtitle={"Liste des agriculteurs"} navigation={navigation} />
            <View style={{ paddingHorizontal: 10, backgroundColor: Colors.whiteColor, marginTop: 10 }}>
                <View>
                    <View style={{width: "96%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: 0}}>
                        <View style={[ inputGroup.container, { flexDirection: "row", backgroundColor: Colors.pillColor }]}>
                            <TouchableHighlight
                                underlayColor={Colors.whiteColor}
                                style={[ inputGroup.iconcontainer, { backgroundColor: Colors.pillColor }]}
                            >
                                <Ionicons name={"md-search"} size={ Dims.iconsize } color={ Colors.primaryColor } />
                            </TouchableHighlight>
                            <View style={[ inputGroup.inputcontainer, { width: "80%", paddingRight: 20, paddingLeft: 20 } ]}>
                                <TextInput 
                                    placeholder="Thomas"
                                    enablesReturnKeyAutomatically 
                                    onChangeText={ handleSearch } 
                                    style={[ inputGroup.input, { fontFamily: "mons", paddingLeft: 0 } ]} 
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: "200%" }}
                    refreshControl={<RefreshControl 
                        refreshing={isloading}
                        onRefresh={ () => {} }
                        colors={[Colors.primaryColor]}
                    />}
                    keyExtractor={(item) => item.id.toString()}
                    data={temp}
                    renderItem={renderItem}
                    ListEmptyComponent={<EmptyList/>}
                />
            </View>
            <Footer/>
        </View>
    )
}