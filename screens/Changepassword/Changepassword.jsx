import * as React from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, Keyboard, TouchableHighlightBase, Linking, SafeAreaView } from 'react-native';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Footer } from '../../components/Footer/comp.footer';
import { Header } from '../../components/Header/comp.header';
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { btn, buttons, dividerStyle, inputGroupForLoginOnly } from '../../assets/styles/Styles';
import { Divider } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { localStorageSAVE, onRunExternalRQST, onRunInsertQRY } from '../../services/communications';
import DialogBox from 'react-native-dialogbox';
import { Loader } from '../../components/Loader/comp.loader';
import { keys, sessionExpires } from '../../assets/Helper/Helpers';

export const Changepasswordscreen = ({ navigation, route }) => {

    const [isloading, setisloading] = React.useState(false);
    const [num, setnum] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [eye, seteye] = React.useState(true);
    const [output, setoutput] = React.useState("");
    const ref = React.useRef();
    const { item, code } = route && route['params'];

    const onSubmit = async () => {
        setoutput("");
        if(num.length >= 4){
            if(password.length >= 4){
                if(num.toString() === password.toString()){
                    setisloading(true)
                    try {
                        await onRunExternalRQST({
                            method: "PUT",
                            url: "/ambassadeurs/update/ambassadeur/password",
                            data:{
                                "idambassadeur": item && item['id'],
                                "newpassword": password,
                                "verificationcode": code
                            }
                        }, (err, done) => {
                            if(done){
                                setisloading(false)
                                switch (done['status']) {
                                    case 200:
                                        const u = item;
                                        try {
                                            onRunInsertQRY({
                                                table: "__tbl_user",
                                                columns: `'realid', 'nom', 'postnom', 'prenom', 'datenaissance', 'email', 'phone', 'adresse', 'genre', 'idvillage', 'crearedon', 'iscollector'`,
                                                dot: "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?",
                                                values: [`${u['id']}`, `${u['nom']}`, `${u['postnom']}`, `${u['prenom']}`, `${u['datenaissance']}`, `${u['email']}`, `${u['phone']}`, `${u['adresse']}`, `${u['genre']}` ,`${u['idvillage']}`, `${new Date().toLocaleString()}`, 0]
                                            }, (err, insert) => {
                                                if(insert){
                                                    localStorageSAVE({
                                                        data: insert,
                                                        expires: sessionExpires,
                                                        key: keys['loginState']
                                                    }, (er, ok) => {
                                                        if(ok){
                                                            global.user = insert;
                                                            global.token = 'zaqxswcde';
                                                            global.iscollecteur = 0;
                                                            navigation.replace("tabs");
                                                        }else{
                                                            Toast.show({
                                                                type: 'error',
                                                                text1: 'Erreur',
                                                                text2: 'Une erreur est survenue lors de la vérification du compte !',
                                                            });
                                                        }
                                                    })
                                                }else{
                                                    setisloading(false);
                                                    console.log(err);
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Erreur',
                                                        text2: 'Une erreur est survenue lors de l\'activation du compte !',
                                                    });
                                                }
                                            })
                                        } catch (error) {
                                            console.log(error);
                                        }
                                        break;
                                    case 203:
                                        setoutput("The password or user name is incorrect")
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur',
                                            text2: 'The password or user name is incorrect',
                                        });
                                        break;
                                    case 402:
                                        setoutput("Your account is not yet activated !")
                                        ref.current.confirm({
                                            title: <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize }}>Account verification</Text>,
                                            content: [<Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, marginHorizontal: 25 }} >Your account is not yet activated, do you want to activate the account</Text>],
                                            ok: {
                                                text: 'Verifiy account',
                                                style: {
                                                    color: Colors.primaryColor,
                                                    fontFamily: 'mons'
                                                },
                                                callback: () => navigation.replace("verifyaccount", { item: done['data'] })
                                            },
                                            cancel: {
                                                text: 'Cancel',
                                                style: {
                                                    color: Colors.darkColor,
                                                    fontFamily: "mons-e"
                                                }
                                            },
                                        })
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur',
                                            text2: 'Your account is not yet activated !',
                                        });
                                        break;
                                    default:
                                        console.log("erreur => ", done);
                                        setoutput("An unknown error has just occurred!")
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Erreur',
                                            text2: 'An unknown error has just occurred!',
                                        });
                                        break;
                                }
                            }else{
                                console.log("erreur => ", done);
                                setisloading(false)
                                setoutput("An unknown error has just occurred!")
                                Toast.show({
                                    type: 'error',
                                    text1: 'Erreur',
                                    text2: 'An unknown error has just occurred!',
                                });
                            }
                        })
                    } catch (error) {
                        console.log(" Error occured => ", error);
                        setoutput("An error occured !")
                        setisloading(false)
                        Toast.show({
                            type: 'error',
                            text1: 'Password is required',
                            text2: 'An error occured !'
                        });
                    }
                }else{
                    setoutput("Les mots de passes doivent être identiques !")
                    Toast.show({
                        type: 'error',
                        text1: 'Champ obligatoire',
                        text2: 'Les mots de passes doivent être identiques !'
                    });
                }
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Champ obligatoir',
                    text2: 'Répéter le mot de passe'
                });
            }
        }else{
            Toast.show({
                type: 'error',
                text1: 'Champ obligatoire',
                text2: 'Entrer un mot de passe avec au minimum 4 caractères !'
            });
        }
    };

    return(
        <>
            <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
                <Header colors={ Colors.whiteColor } />
                <ScrollView 
                    // endFillColor={Colors.primaryColor}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ paddingBottom: 0, backgroundColor: Colors.primaryColor }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ borderTopEndRadius: Dims.bigradius, borderTopStartRadius: Dims.bigradius, backgroundColor: Colors.whiteColor, height: Dims.height, marginTop: Dims.smallradius }}>
                        <View style={{ width: "85%", alignSelf: "center", height: 50, alignContent: "center", alignItems: 'center', marginTop: Dims.bigradius }}>
                            <Text style={{ fontFamily: "mons-b", textAlign: "center", fontSize: Dims.titletextsize + 4, color: Colors.primaryColor }}>Nouveau mot de passe</Text>
                            <TouchableHighlight
                                underlayColor={"transparent"}
                                onPress={() => {
                                    // Linking.openURL("")
                                }}
                            >
                                <Text style={{ fontFamily: "mons-e", textAlign: "center" }}>Vous pouvez à présent Créer un nouveau de passe</Text>
                            </TouchableHighlight>
                            <Divider />
                        </View>
                        <View style={{width: "85%", alignSelf: "center", marginTop: 5 }}>
                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Nouveau mot de passe<Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={[ inputGroupForLoginOnly.container, { flexDirection: "row-reverse" }]}>
                                    <TouchableHighlight
                                        underlayColor={Colors.whiteColor}
                                        onPress={() => seteye(!eye)} 
                                        style={[ inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}
                                    >
                                        <Ionicons name={eye ? "eye-off" : "eye"} size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </TouchableHighlight>
                                    <View style={[ inputGroupForLoginOnly.inputcontainer, { width: "60%" } ]}>
                                        <TextInput placeholder='******' secureTextEntry={eye} enablesReturnKeyAutomatically onChangeText={(t) => setnum(t)} style={[ inputGroupForLoginOnly.input, { fontFamily: "mons" } ]} />
                                    </View>
                                    <View style={[ inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}>
                                        <Entypo name="lock" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>

                            {/* ------------------------------- */}

                            <View style={{width: "100%", height: 65, flexDirection: "column", marginTop: 15}}>
                                <Text style={{ fontFamily: "mons-b", paddingLeft: 10, color: Colors.primaryColor }}>Répéter le mot passe <Text style={{ color: Colors.dangerColor }}>*</Text></Text>
                                <View style={[ inputGroupForLoginOnly.container, { flexDirection: "row-reverse" }]}>
                                    <TouchableHighlight
                                        underlayColor={Colors.whiteColor}
                                        onPress={() => seteye(!eye)} 
                                        style={[ inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}
                                    >
                                        <Ionicons name={eye ? "eye-off" : "eye"} size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </TouchableHighlight>
                                    <View style={[ inputGroupForLoginOnly.inputcontainer, { width: "60%" } ]}>
                                        <TextInput placeholder='******' secureTextEntry={eye} enablesReturnKeyAutomatically onChangeText={(t) => setpassword(t)} style={[ inputGroupForLoginOnly.input, { fontFamily: "mons" } ]} />
                                    </View>
                                    <View style={[ inputGroupForLoginOnly.iconcontainer, { backgroundColor: Colors.pillColor }]}>
                                        <Entypo name="lock" size={ Dims.iconsize } color={ Colors.primaryColor } />
                                    </View>
                                </View>
                            </View>

                            {/* ---------------------------------- */}

                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginVertical: 15 }}>
                                <TouchableHighlight 
                                    onPress={() => {
                                            onSubmit()
                                        }
                                    }
                                    disabled={isloading}
                                    underlayColor={ Colors.primaryColor }
                                    style={ btn }
                                >
                                    { isloading ? <Loader/> : <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Confirmer</Text> }
                                </TouchableHighlight>
                                <Text style={{fontFamily: "mons", fontSize: Dims.subtitletextsize, marginVertical: 10, color: Colors.dangerColor, textAlign: "center" }}>
                                    {output}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", width: "85%", alignSelf: "center", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ width: "35%" }}>
                                <Divider style={dividerStyle} />
                            </View>
                            <View>
                                <Text style={{ fontFamily: "mons-b", color: Colors.primaryColor }}>OU</Text>
                            </View>
                            <View style={{ width: "35%" }}>
                                <Divider style={dividerStyle} />
                            </View>
                        </View>
                        <View style={{ width: "85%", alignSelf: "center" }}>
                            <View style={{ width: "100%", height: 65, flexDirection: "column", marginTop: 25 }}>
                                <TouchableHighlight 
                                    underlayColor={Colors.secondaryColor}
                                    onPress={() => navigation.navigate("signup")}
                                    style={[btn, { backgroundColor: Colors.secondaryColor }]}>
                                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Connexion avec un autre compte</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Footer />
                <DialogBox ref={ref} isOverlayClickClose={false} />
            </View>
        </>
    )
}