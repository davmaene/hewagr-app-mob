import * as React from 'react';
import { FlatList, RefreshControl, TextInput, TouchableHighlight, Text } from 'react-native';
import { View } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { inputGroup } from '../../assets/styles/Styles';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Feather, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Avatar, Divider } from 'react-native-elements';
import { returnInitialOfNames } from '../../assets/Helper/Helpers';

export const ListeChampsScreen = ({ navigation, route }) => {
    const data = route && route['params'] && route['params']['liste'] && route['params']['liste'];
    const [isloading, setisloading] = React.useState(false);
    const liste = data && data['liste'];
    const length = data && data['length'];
    const [temp, settemp] = React.useState(liste);

    // console.log("Data is => ", liste);

    const handleSearch = async (text) => {
        if(1 && liste.length && text.length > 0 && text !== "" && text !== " "){
            const filteredRows = liste.filter((row) => {
                return row['__tbl_agriculteur'].nom.toLowerCase().includes(text.toLowerCase()) ? row : null;
            });
            settemp(filteredRows);
        }else settemp(liste);
    }

    const renderItem = ({ item }) => {
        const agr = item && item['__tbl_agriculteur'];
        const color = Colors.primaryColor;// randomColor() ||
        // console.log(" Agriculteur ", agr);
        // console.log(" Champs ", item);
        return(
            <TouchableHighlight
                style={{  }}
                underlayColor={ Colors.pillColor }
                onPress={() => {
                    navigation.navigate("champs", { item, id: item && item['id'] })
                }}
            >
                <View style={{ width: "100%", backgroundColor: Colors.pillColor, height: "auto", marginTop: 10, paddingHorizontal: 5, padding: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View>
                            <Avatar
                                // rounded
                                title={<Text style={{ textTransform: "uppercase", fontFamily: "mons-b", fontSize: Dims.titletextsize }}>{returnInitialOfNames({ fsname: agr && agr['nom'], lsname: agr && agr['postnom'] })}</Text>}
                                containerStyle={{ backgroundColor: color, borderRadius: Dims.borderradius }}
                                size="medium"
                                key={item && item['id']}
                            />
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <Text style={{ fontFamily: "mons", textTransform: "capitalize" }}> {agr && agr['nom']} {agr && agr['postnom']} {agr && agr['prenom'] !== "#" && agr['prenom']} </Text>
                            <Text style={{ fontFamily: "mons-e", paddingLeft: 2 }}>{ agr && agr['phone'] }</Text>
                            {/* <Text style={{ fontFamily: "mons", paddingLeft: 2 }}>{ agr && agr['email'] }</Text> */}
                            <Text style={{ fontFamily: "mons-e", paddingLeft: 2 }}>Mebre d'une Coopérative : <Text style={{ fontFamily: "mons" }}>{ agr && agr['membrecooperative'] ? "OUI" : "NON" }</Text></Text>
                        </View>
                    </View>
                    <Divider style={{ marginVertical: 10, alignItems: "center" }} />
                    <View style={{ paddingVertical: 3 }}>
                        <Text style={{ fontSize: Dims.subtitletextsize, fontFamily: "mons", textAlign: "center" }}>Informations sur le champs</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                            <View>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.titletextsize, textAlign: "center" }}>Nom du champ</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textAlign: "center" }}>{item && item['champs']}</Text>
                            </View>
                            {/* <View>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.titletextsize }}>Longitude</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>{item && item['longitude']}</Text>
                            </View> */}
                            <View>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.titletextsize, textAlign: "center" }}>Dimensions</Text>
                                <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, textAlign:"center" }}>{item && item['dimensions']}(ha)</Text>
                            </View>
                        </View>
                    </View>
                    <Divider style={{ marginVertical: 3 }} />
                    <View style={{ paddingVertical: 3 }}>
                        <Text style={{ fontSize: Dims.subtitletextsize, fontFamily: "mons", textAlign: "center" }}>Informations sur les cultures</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>

                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    return (
        <>
            <Title title={"Champs"} subtitle={"Liste des champs"} navigation={navigation} />
            <View style={{ backgroundColor: Colors.whiteColor }}>
                <View style={{width: "96%", alignSelf: "center", height: 65, flexDirection: "column", marginTop: 10}}>
                    <View style={[ inputGroup.container, { flexDirection: "row", backgroundColor: Colors.pillColor }]}>
                        <TouchableHighlight
                            underlayColor={Colors.whiteColor}
                            style={[ inputGroup.iconcontainer, { backgroundColor: Colors.pillColor }]}
                        >
                            <Ionicons name={"md-search"} size={ Dims.iconsize } color={ Colors.primaryColor } />
                        </TouchableHighlight>
                        <View style={[ inputGroup.inputcontainer, { width: "80%", paddingRight: 20, paddingLeft: 0 } ]}>
                            <TextInput 
                                placeholder="Thomas"
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
                contentContainerStyle={{ paddingBottom: "100%", backgroundColor: Colors.whiteColor, paddingHorizontal: 10 }}
                refreshControl={
                    <RefreshControl 
                        refreshing={isloading}
                        onRefresh={ () => {}}
                        colors={[Colors.primaryColor]}
                    />
                }
                keyExtractor={(item) => item.id.toString()}
                data={temp}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyList />}
                ListFooterComponent={() => (
                    <>
                        <View style={{ paddingTop: 50 }} />
                        <Footer/>
                    </>
                )}
            />
        </>
    )
}