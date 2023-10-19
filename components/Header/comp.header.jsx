import * as React from 'react';
import { View, Text, StatusBar, Keyboard, Animated } from 'react-native';
import { Divider } from 'react-native-paper';
import { Colors } from '../../assets/colors/Colors';
import { appname, appslogan } from '../../assets/configs/configs';
import { Image } from 'react-native-elements';
import { Loader } from '../Loader/comp.loader';
import { Dims } from '../../assets/dimensions/Dimemensions';

export const Header = ({ colors }) => {
    const [shown, setshown] = React.useState(false);
    const [anim, setanim] = React.useState(.5)
    // React.useRef(new Animated.Value(0)).current

    React.useEffect(() => {

        Keyboard.addListener("keyboardDidHide", e => {
            setanim(1)
            setshown(false)
        });

        Keyboard.addListener("keyboardDidShow", e => {
            setshown(true)
        });

    }, [])

    return (
        <>
            <StatusBar backgroundColor={Colors.primaryColor} barStyle={colors ? "light-content" : "default"} />
            {!shown &&
                (
                    <View style={{ padding: 10, alignContent: "center", alignSelf: "center", marginTop: 5, height: 210, justifyContent: "center" }}>
                        <View style={{ alignSelf: "center" }}>
                            <Animated.Image
                                source={colors && colors === Colors.primaryColor ? require("../../assets/images/hewagri-logo.png") : require("../../assets/images/HewAgri_Icon-5.png")}
                                style={{ opacity: anim, width: 200, height: 160, resizeMode: "center", alignSelf: "center", backgroundColor: "transparent" }}
                                PlaceholderContent={<Loader color={Colors.whiteColor} />}
                            />
                        </View>
                        <View style={{ marginTop: -40 }}>
                            <Text style={{ fontFamily: "mons-b", textAlign: "center", fontSize: 35, color: colors ? colors : Colors.primaryColor }}>{appname}</Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e", color: colors ? colors : Colors.primaryColor }} >{appslogan} </Text>
                        </View>
                    </View>
                )
            }

            {/* ====================================================== */}
            {shown &&
                (
                    <View style=
                        {
                            {
                                padding: 10,
                                alignContent: "center",
                                alignSelf: "center",
                                marginTop: 5,
                                height: 100,
                                alignItems: "center",
                                // backgroundColor: "lime",
                                justifyContent: "center",
                                flexDirection: "row"
                            }
                        }
                    >
                        <View style={{ alignSelf: "flex-start", width: "35%" }}>
                            <Animated.Image
                                source={colors && colors === Colors.primaryColor ? require("../../assets/images/hewagri-logo.png") : require("../../assets/images/HewAgri_FN-02.png")}
                                style={{ opacity: 1, width: 140, height: 100, resizeMode: "cover", alignSelf: "center" }}
                                PlaceholderContent={<Loader color={Colors.whiteColor} />}
                            />
                        </View>
                        <View style={{ borderRightColor: Colors.whiteColor, borderRightWidth: 2, width: "5%", height: "100%", paddingHorizontal: 10 }} />
                        <View style={{ width: "60%", height: 35, paddingLeft: 10 }}>
                            <Text style={{ fontFamily: "mons-b", textAlign: "center", fontSize: Dims.titletextsize * .8, color: colors ? colors : Colors.primaryColor, flex: 0, paddingVertical: 2 }}>{appslogan}</Text>
                            <Text style={{ textAlign: "center", fontFamily: "mons-e", color: colors ? colors : Colors.primaryColor }} >Avec {appname} la météo agricole est 100% rassurée</Text>
                        </View>
                    </View>
                )
            }
        </>
    )
}