import { Colors } from "../colors/Colors";
import { Dims } from "../dimensions/Dimemensions";
import { StyleSheet } from "react-native";

export const inputGroup = StyleSheet.create({
    container: {
        width: "100%", 
        borderColor: Colors.aPillColor,//Colors.pillColor, 
        borderRadius: Dims.borderradius, 
        borderWidth: .6, 
        marginTop: 5, 
        height: Dims.inputTextHeight, 
        flexDirection: "row", 
        overflow: "hidden"
    },
    iconcontainer: {
        width: "20%", 
        justifyContent: "center", 
        alignContent: "center", 
        alignItems: "center",
        height: "100%",
        display: "none",
        backgroundColor: Colors.pillColor
    },
    inputcontainer: {
        width: "100%", 
        justifyContent: "center",
        alignContent: "center", 
        alignItems: "center", 
        // color: "lime"
    },
    input: { 
        color: Colors.primaryColor, 
        backgroundColor: Colors.pillColor, 
        height: "100%", 
        width: "100%", 
        paddingLeft: 0, 
        fontSize: Dims.iputtextsize 
    },
    incon: {
        width: "20%", 
        justifyContent: "center", 
        alignContent: "center", 
        alignItems: "center",
         height: "100%"
    },
    label: {
        fontFamily: "mons", 
        paddingLeft: 10, 
        color: Colors.primaryColor
    }
});

export const inputGroupForLoginOnly = StyleSheet.create({
    container: {
        width: "100%", 
        borderColor: Colors.aPillColor,//Colors.pillColor, 
        borderRadius: Dims.borderradius, 
        borderWidth: .6, 
        marginTop: 5, 
        height: Dims.inputTextHeight, 
        flexDirection: "row", 
        overflow: "hidden"
    },
    iconcontainer: {
        width: "20%", 
        justifyContent: "center", 
        alignContent: "center", 
        alignItems: "center",
        height: "100%",
        // display: "none",
        backgroundColor: Colors.pillColor
    },
    inputcontainer: {
        width: "100%", 
        justifyContent: "center",
        alignContent: "center", 
        alignItems: "center", 
        // color: "lime"
    },
    input: { 
        color: Colors.primaryColor, 
        backgroundColor: Colors.pillColor, 
        height: "100%", 
        width: "100%", 
        paddingLeft: 0, 
        fontSize: Dims.iputtextsize 
    },
    incon: {
        width: "20%", 
        justifyContent: "center", 
        alignContent: "center", 
        alignItems: "center",
         height: "100%"
    },
    label: {
        fontFamily: "mons", 
        paddingLeft: 10, 
        color: Colors.primaryColor
    }
});

export const btn = StyleSheet.create({ 
    width: "100%", 
    backgroundColor: Colors.primaryColor, 
    height: Dims.inputTextHeight, 
    borderRadius: Dims.borderradius, 
    justifyContent: "center", 
    alignContent: "center", 
    alignItems: "center" 
});

export const map = StyleSheet.create({
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
});

export const shadow = StyleSheet.create({
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { 
        width: -1, 
        height: 1
    },
    textShadowRadius: 10
})

export const button = StyleSheet.create({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
});

export const modal = StyleSheet.create({
    justifyContent: 'flex-end',
    margin: 0,
});

export const cel = StyleSheet.create({ 
    color: Colors.primaryColor, 
    backgroundColor: Colors.pillColor, 
    height: 38, 
    width: "16%", 
    textAlign: "center", 
    fontSize: Dims.iputtextsize + 8, 
    justifyContent: "center" 
});

export const card = StyleSheet.create({ 
    width: "45%", 
    paddingTop: 3, 
    overflow: "hidden",
    borderBottomEndRadius: 2, 
    borderBottomStartRadius: 2,
    backgroundColor: Colors.dangerColor, 
    height: Dims.cardHeigth, 
    borderRadius: Dims.borderradius, 
    elevation: Dims.elevation 
});

export const buttons = StyleSheet.create({
    backgroundColor: Colors.whiteColor,
    flexDirection: 'column',
    borderTopRightRadius: Dims.borderradius + 20,
    borderTopLeftRadius: Dims.borderradius + 20,
});

export const customStyles = {
    marginTop: 20,
    stepIndicatorSize: 25,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.primaryColor,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: Colors.primaryColor,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Colors.primaryColor,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Colors.primaryColor,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: Colors.primaryColor,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: Colors.primaryColor
};

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    button: {
      marginVertical: 5,
    },
    bottomBar: {
        position: "absolute",
        // backgroundColor: "lime",
        bottom: -7,
        padding: 0,
        margin: 0
    },
    btnCircle: {
      width: 60,
      height: 60,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primaryColor,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0.5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 1,
      bottom: 30,
    },
    imgCircle: {
      width: 30,
      height: 30,
      tintColor: 'gray',
    },
    img: {
      width: 30,
      height: 30,
    },
});

export const btnSpeedDial = StyleSheet.create({ 
    width: ( Dims.tabBottomHeight * .8 ), 
    height: ( Dims.tabBottomHeight * .8 ), 
    backgroundColor: Colors.whiteColor, 
    borderRadius: Dims.tabBottomHeight,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center" 
});

export const btnDial = StyleSheet.create({
    // backgroundColor: "transparent", 
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
    padding: 2, 
    borderRadius: 14, 
    // elevation: 10
});