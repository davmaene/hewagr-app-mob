import * as React from 'react';
import { View, Text, TouchableHighlight, RefreshControl, FlatList } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { EmptyList } from '../../components/Emptylist/com.emptylist';
import { Footer } from '../../components/Footer/comp.footer';
import { Title } from '../../components/Title/Title';
import { Avatar, Divider } from 'react-native-elements';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { returnInitialOfNames, returnSouscriptipnCategory } from '../../assets/Helper/Helpers';
import DialogBox from 'react-native-dialogbox';

export const ListeSouscriptionsScreen = ({ navigation, route }) => {

    const data = route && route['params'] && route['params']['liste'] && route['params']['liste'];
    const liste = data && data['liste'];
    const length = data && data['length'];
    const [isloading, setisloading] = React.useState(false);
    const [temp, settemp] = React.useState(liste);
    const ref = React.useRef();

    const renderItem = ({ item }) => {
        
        const agr = item && item['__tbl_agriculteur'];
        const lg = item && item['__tbl_langue'];
        const color = Colors.primaryColor;

        // randomColor() ||
        // console.log(" Agriculteur ", agr);
        // console.log(" Champs ", item);
        
        return(
            <TouchableHighlight
                style={{  }}
                underlayColor={ Colors.pillColor }
                onPress={() => {
                    // navigation.navigate("detailsouscription", { item, id: item && item['id'] })
                    ref.current.tip({
                        title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Abonnement <Text>{returnSouscriptipnCategory({ category: item['categorie'] })}</Text></Text>,
                        content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Souscription de <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor, textTransform:"capitalize" }}>{agr && agr['nom']} {agr && agr['postnom']}</Text>  en date du {item && item['datedebut']} et prendra fin en date du {item && item['datefin']} Solde restant <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor, textTransform:"uppercase" }}>{item['nbmessage']}SMS</Text></Text>],
                        btn: {
                            text: 'OK !',
                            style: {
                                color: Colors.primaryColor,
                                fontFamily: 'mons'
                            },
                            callback: () => {

                            }
                        }
                    })

                }}
            >
                <View style={{ width: "100%", backgroundColor: Colors.pillColor, height: "auto", marginTop: 10, paddingHorizontal: 5, padding: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ paddingLeft: 5 }}>
                            <Avatar
                                // rounded
                                title={<Text style={{ textTransform: "uppercase", fontFamily: "mons-b", fontSize: Dims.titletextsize }}>{returnInitialOfNames({ fsname: agr && agr['nom'], lsname: agr && agr['postnom'] })}</Text>}
                                containerStyle={{ backgroundColor: color, borderRadius: Dims.borderradius }}
                                size="medium"
                                key={item && item['id']}
                            />
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            {/* {agr && agr['prenom'] !== "#" && agr['prenom']}  */}
                            <Text style={{ fontFamily: "mons-b", textTransform: "capitalize" }}> {agr && agr['nom']} {agr && agr['postnom']} </Text>
                            <Text style={{ fontFamily: "mons-e", paddingLeft: 2 }}>{ agr && agr['phone'] }</Text>
                            <Text style={{ fontFamily: "mons-e", paddingLeft: 2 }}>Mebre d'une Coopérative : <Text style={{ fontFamily: "mons" }}>{ agr && agr['membrecooperative'] ? "OUI" : "NON" }</Text></Text>
                        </View>
                    </View>
                    <Divider style={{ marginVertical: 10, alignItems: "center" }} />
                    <View style={{ paddingVertical: 3 }}>
                        <Text style={{ fontSize: Dims.subtitletextsize, fontFamily: "mons", textAlign: "center" }}>Informations sur la souscription</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                            <View>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.titletextsize, textAlign: "center" }}>Date début</Text>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, textAlign: "center" }}>{item && item['datedebut']}</Text>
                            </View>
                            <View>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.titletextsize, textAlign: "center" }}>Date de fin</Text>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, textAlign: "center" }}>{item && item['datefin']}</Text>
                            </View>
                            <View>
                                <Text style={{ fontFamily: "mons-e", fontSize: Dims.titletextsize, textAlign: "center" }}>Solde message</Text>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, textAlign: "center", color: Colors.primaryColor }}>{item && item['nbmessage'] ? item['nbmessage'] : "---"}SMS</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    React.useEffect(() => {
        
    }, []);

    return (
        <>
            <Title title={"Abonnements aux info météo"} subtitle={"Liste d'abonnements aux infos météo"} navigation={navigation} />
            <View style={{ paddingHorizontal: 10, backgroundColor: Colors.whiteColor }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: "100%", backgroundColor: Colors.whiteColor }}
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
                />
            </View>
            <Footer/>
            <DialogBox ref={ref} isOverlayClickClose={true} />
        </>
    )
}