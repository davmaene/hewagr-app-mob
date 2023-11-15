import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard, RefreshControl } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { cel, inputGroup } from '../../assets/styles/Styles';
import { Divider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { localStorageSAVE, onRunExternalRQST, onRunInsertQRY, onRunRetrieveQRY } from '../../services/communications';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell
} from 'react-native-confirmation-code-field';
import { Loader } from '../../components/Loader/comp.loader';
import { keys, sessionExpires } from '../../assets/Helper/Helpers';

const CELL_COUNT = 6;
export const VerifyAccountOnForgetenScreen = ({ navigation, route }) => {

    const item = route && route['params'] && route['params']['item'];
    const user = item && item['user'];
    const code = item && item['code'];
    const [isloading, setisloading] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [canverify, setcanverify] = React.useState(true); 
    const [c, setc] = React.useState(code);
    const [u, setu] = React.useState(user);
    let [tries, settries] = React.useState(0);

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const onVerify = () => {
        setisloading(true)
        if(value === c){
            navigation.replace("changepassword", { item: u })
        }else{
            setisloading(false)
            setValue("")
            settries(++tries);
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Le code entrer est incorrect !',
            });
        }
    };

    const onValueFulFil = () => {
        if(value.length === CELL_COUNT){
            setcanverify(true);
            setisloading(true)
            onVerify();
        }
    };

    const onSubmit = async () => {
        setisloading(true);
        setcanverify(false);
        await onRunExternalRQST({
            method: "PUT",
            url: "/ambassadeurs/ambassadeur/resendcode",
            data: {
                oldcode: c,
                email: u && u['phone']
            }
        }, (err, done) => {
            if(done){
                setcanverify(true);
                setisloading(false);
                switch (done['status']) {
                    case 200:
                        Toast.show({
                            type: 'success',
                            text1: 'Code envoyé',
                            text2: 'Un nouveau code vous a été envoyé !',
                        });
                        setc(done && done['data']['code']);
                        break;
                    case 500:
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Une erreur inconue vient de se produire !',
                        });
                        break;
                    default:
                        Toast.show({
                            type: 'error',
                            text1: 'Erreur',
                            text2: 'Une erreur inconue vient de se produire !',
                        });
                        break;
                }
            }else{
                setcanverify(true);
                setisloading(false);
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Une erreur inconue vient de se produire !',
                });
            }
        })
    };

    React.useEffect(() => {
        onValueFulFil()
    }, [onValueFulFil])

    return(
        <>
            <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
                <Header colors={Colors.whiteColor} />
                    <ScrollView 
                        contentContainerStyle={{ paddingBottom: 0, backgroundColor: Colors.primaryColor }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}

                        refreshControl={
                            <RefreshControl
                                refreshing={isloading}
                                colors={[ Colors.primaryColor ]}
                            />
                        }
                    >
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: Dims.height, marginTop: Dims.smallradius }}>
                        <View style={{ width: "85%", alignSelf: "center", marginTop: Dims.bigradius }}>
                            <Text style={{fontFamily: "mons-e", textAlign: "center"}}>Nous venons d'envoyer un code de vérification au numéro de téléphone <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{u && u['phone']}</Text> et à l'adresse mail suivante <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>{u && u['email']}</Text></Text>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center", marginTop: 5 }}>
                            <View style={{width: "100%", height: 75, flexDirection: "column"}}>
                                <View style={[ inputGroup.iconcontainer, { backgroundColor: "transparent", alignSelf: "center" }]}>
                                    <Entypo name="lock" size={Dims.iconsize * 2} color={ Colors.primaryColor } />
                                </View>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 0, color: Colors.primaryColor, alignSelf: "center" }}>Code de vérification</Text>
                            </View>
                            <View style={{ marginVertical: 10, height: 45, marginTop: 25, flexDirection: "row", justifyContent: "space-around" }}>
                            <CodeField
                                ref={ref}
                                {...props}
                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={{marginTop: 20}}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({index, symbol, isFocused}) => (
                                <Text
                                    key={index}
                                    style={[cel,{ fontFamily: "mons", justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", paddingTop: 5 }, isFocused && {borderColor: '#000'}]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                                )}
                            />
                            </View>
                            {/* ------------------------ */}
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 10 }}>
                                <TouchableHighlight 
                                    onPress={() => {
                                        onVerify()
                                    }}
                                    disabled={canverify}
                                    underlayColor={ Colors.whiteColor }
                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    {isloading 
                                    ?
                                    <Loader/>
                                    :
                                    <Text style={{ color: !canverify ? Colors.whiteColor : Colors.whiteColor, fontFamily: "mons" }}>Vérifier</Text>    
                                    }
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", width: "85%", alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ width: "20%" }}>
                                <Divider/>
                            </View>
                            <View>
                                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}> CODE NON RECU ?</Text>
                            </View>
                            <View style={{ width: "20%" }}>
                                <Divider/>
                            </View>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center" }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 10 }}>
                                <TouchableHighlight 
                                    underlayColor={Colors.pillColor}
                                    onPress={() => onSubmit()}
                                    style={{ width: "100%", backgroundColor: Colors.pillColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons" }}>Renvoyer le code de vérification ?</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center", display: tries >= 3 ? "flex" : "none" }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 0 }}>
                                <TouchableHighlight 
                                    underlayColor={Colors.pillColor}
                                    onPress={() => navigation.navigate("signup")}
                                    style={{ width: "100%", backgroundColor: Colors.primaryColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Créer un compte</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center", display: tries >= 3 ? "flex" : "none" }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 2 }}>
                                <TouchableHighlight 
                                    underlayColor={Colors.pillColor}
                                    onPress={() => navigation.navigate("signin")}
                                    style={{ width: "100%", backgroundColor: Colors.pillColor, height: 46, borderRadius: Dims.borderradius, justifyContent: "center", alignContent: "center", alignItems: "center" }}
                                >
                                    <Text style={{ color: Colors.primaryColor, fontFamily: "mons-b" }}>Connexion avec un autre compte ?</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Footer/>
            </View>
        </>
    )
}