import * as React from 'react';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { Text, View, SafeAreaView, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign, Entypo, Ionicons, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { btn, buttons, map, modal } from '../../assets/styles/Styles';
import { Loader } from '../Loader/comp.loader';

export const BottomSheetDialog = ({ navigation, visible, title: { text, color }, subTitle: { sText, sColor } }) => {

    const [ isVisible, setisVisible ] = React.useState(visible);

    return(
        <Modal
            isVisible={isVisible}
            animationIn={"slideInUp"}
            animationOut={"slideInDown"}
            onBackButtonPress={() => { setisVisible(!isVisible) }}
            onBackdropPress={() => { setisVisible(!isVisible) }}
            style={modal}
        >
            <SafeAreaView style={[buttons, { paddingVertical: 15, height: "auto" }]}>
                <View style={{ width: "90%", flexDirection: "column", justifyContent: "space-between", alignSelf: "center", minHeight: 100 }}>
                    <View style={{ alignContent: "center", alignItems: "center", alignSelf: "center", marginTop: 20, marginBottom: 10 }}>
                        <MaterialIcons name='wifi-off' color={Colors.dangerColor} size={50} />
                    </View>
                    <>
                        <View style={{ height: 55, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "mons", fontSize: Dims.titletextsize, paddingTop: 5, textAlign: "center", color: color ? color : Colors.darkColor }}>{ text }</Text>
                            <Text style={{ fontFamily: "mons-e", fontSize: Dims.subtitletextsize, textAlign: "center", color: sColor ? sColor : Colors.darkColor, paddingTop: 10 }}>{ sText }</Text>
                        </View>
                    </>
                </View>
            </SafeAreaView>
        </Modal>
    )
}