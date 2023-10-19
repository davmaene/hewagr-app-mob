import * as React from 'react';
import { View, Text } from 'react-native';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Colors } from '../../assets/colors/Colors';
import { AntDesign, FontAwesome, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { btnDial, btnSpeedDial } from '../../assets/styles/Styles';
import { TouchableHighlight } from 'react-native';
import Toast from 'react-native-toast-message';
import { Animated, Easing } from 'react-native';
import GLOBALP from '../GlobalHookAndStateProfile/GlobalHookAndStateProfile';

class SpeedDialProfileCustomer extends React.Component {

    // const init = ( global && global.iscollecteur === 1 ) ? 1 : 0;
    // const [visible, setisVisible] = React.useState(isvisible)
    // const anim = React.useRef(new Animated.Value(0)).current;

    constructor(props){
        super(props);
        this.state = {
            navigation: null,
            init: ( global && global.iscollecteur === 1 ) ? 1 : 0,
            visible: false,
            anim: new Animated.Value(0)
        }
        GLOBALP.ScreenGlobalProfile = this;
    };

    onNotify ()  {
        
        Toast.show({
            type: 'info',
            text1: 'Info',
            text2: 'Vous n\'avez pas accès à cette ressource !',
        });
    };

    FadeOut () {

        Animated.timing(this.state.anim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
        }).start();
    };

    FadeIn () {

        Animated.timing(this.state.anim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
    };

    componentDidUpdate(){
        this.FadeIn()
    }

    componentWillUnmount(){
        this.FadeIn()
    }
    
    render() {
        return(
            <View
                onTouchStart={() => {
                    this.FadeOut()
                    this.setState({
                        visible: !this.state.visible
                    })
                }}
                style={[{}, { display: this.state.visible ? "flex" : "none", backgroundColor: 'rgba(0,0,0,.7)', height: Dims.height, position: "absolute", width: Dims.width }]}
            >
                <View style={{ position: "absolute", width: 300, height: ( Dims.tabBottomHeight * 1.2 ) * ( 3 * 1.2 ), backgroundColor: "transparent", bottom: Dims.tabBottomHeight * 4, alignSelf: "center", padding: 5 }}>
                    <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-around", marginBottom: 20 }}>
                        <TouchableHighlight
                            underlayColor={Colors.whiteColor}
                            // disabled={init}
                            style={[btnDial]}
                            onPress={() => {
                                if(this.state.init) this.onNotify();
                                else this.state.navigation.navigate("souscription");
                            }}
                        >
                            <>
                                <Animated.View 
                                    style={[btnSpeedDial, { opacity: this.state.anim }]}
                                >
                                    <MaterialCommunityIcons name="weather-lightning" size={Dims.iconsize * 1.2} color={Colors.primaryColor} />
                                </Animated.View>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, color: Colors.whiteColor, textAlign: "center", paddingTop: 4 }} >Abonnement infos Météo</Text>
                            </>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-around", marginBottom: 20 }}>
                        <TouchableHighlight
                            style={[btnDial]}
                            underlayColor={Colors.pillColor}
                            // disabled={init}
                            onPress={() => {
                                if(this.state.init) this.onNotify();
                                else this.state.navigation.navigate("conseil")
                            }}
                        >
                            <>
                                <Animated.View 
                                    style={[btnSpeedDial, { opacity: this.state.anim }]}
                                >
                                    <FontAwesome name="hard-of-hearing" size={Dims.iconsize + 5} color={Colors.primaryColor} />
                                </Animated.View>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, color: Colors.whiteColor, textAlign: "center", paddingTop: 4 }} >Conseils agricoles</Text>
                            </>
                        </TouchableHighlight>
    
                        <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            // disabled={init}
                            onPress={() => {
                                if(this.state.init) this.onNotify();
                                else this.state.navigation.navigate("abonnement")
                            }}
                            style={[ btnDial ]}
                        >
                            <>
                                <Animated.View 
                                    style={[btnSpeedDial, { opacity: this.state.anim }]}
                                >
                                    <Fontisto name="money-symbol" size={Dims.iconsize + 5} color={Colors.primaryColor} />
                                </Animated.View>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, color: Colors.whiteColor, textAlign: "center", paddingTop: 4 }} >Prix du marché</Text>
                            </>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-between" }}>
                        <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            onPress={() => {
                                this.state.navigation.navigate("collect")
                            }}
                            style={[ btnDial ]}
                        >
                            <>
                                <Animated.View 
                                    style={[btnSpeedDial, { opacity: this.state.anim }]}
                                >
                                    <AntDesign name="addfile" size={Dims.iconsize + 3} color={Colors.primaryColor} />
                                </Animated.View>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, color: Colors.whiteColor, textAlign: "center", paddingTop: 4 }} >Nouvelle Collecte</Text>
                            </>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={Colors.pillColor}
                            style={[ btnDial ]}
                            onPress={() => {
                                this.state.navigation.navigate("sync")
                            }}
                        >
                            <>
                                <Animated.View 
                                    style={[btnSpeedDial, { opacity: this.state.anim }]}
                                >
                                    <AntDesign name="sync" size={Dims.iconsize + 1} color={Colors.primaryColor} />
                                </Animated.View>
                                <Text style={{ fontFamily: "mons-b", fontSize: Dims.subtitletextsize, color: Colors.whiteColor, textAlign: "center", paddingTop: 4 }} > Synchronisation</Text>
                            </>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}

export {
    SpeedDialProfileCustomer
}