import React from 'react';
import { StatusBar } from 'react-native';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Colors } from '../../assets/colors/Colors';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { btn } from '../../assets/styles/Styles';
import { Loader } from '../../components/Loader/comp.loader';
import { Ionicons } from 'react-native-vector-icons';
import { appname } from '../../assets/configs/configs';

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: "hewAgri",
    image: require('../../assets/intros/1.png'),
    backgroundColor: Colors.whiteColor,
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'hewAgri',
    image: require('../../assets/intros/2.png'),
    backgroundColor: Colors.whiteColor,
  },
  {
    key: 3,
    title: 'Title 3',
    text: 'hewAgri',
    image: require('../../assets/intros/3.png'),
    backgroundColor: "#75d1ce"// || Colors.whiteColor,
  }
];
 
export default class Introductionscreen extends React.Component {
 constructor(props){
    super(props)
    this.state = {
        showRealApp: false
    }
 }
  _renderItem = ({ item }) => {
    return (
      <>
        <StatusBar backgroundColor={ Colors.whiteColor || item && item['backgroundColor'] } barStyle={"dark-content"} />
        <View style={{width: "100%", flex: 1, justifyContent: "center", backgroundColor: Colors.whiteColor}}>
          <Image source={item.image} style={{height: "100%", width: "100%", resizeMode: "cover"}} />
        </View>
      </>
    );
  }

  _renderNextButton = () => {
    return (
      <View style={btn}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{fontFamily: "mons-b", color: Colors.whiteColor, paddingRight: Dims.borderradius}}>Suivant</Text>
            <Ionicons name='arrow-forward-outline' size={18} color={Colors.whiteColor} />
          </View>
      </View>
    );
};

 _renderPreviusButton = () => {
    return (
      <View style={btn}>
        <Ionicons name='arrow-back-outline' size={18} color={Colors.whiteColor} />
      </View>
    );
};

 _renderDonesButton = () => {
    return (
      <View style={[btn, { backgroundColor: Colors.whiteColor }]}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{fontFamily: "mons-b", color: Colors.primaryColor, paddingRight: Dims.borderradius}}>Commencer avec {appname}</Text>
            <Ionicons name='checkmark-done-outline' size={18} color={Colors.primaryColor} />
          </View>
      </View>
    );
};

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // this.setState({ showRealApp: true });
    this.props.navigation.replace("signin");
  }
  render() {
    if (this.state.showRealApp) {
      return (
        <Loader/>
      );
    } else {
      return (
          <AppIntroSlider 
            renderItem={this._renderItem} 
            data={slides} 
            onDone={this._onDone}
            renderSkipButton={true}
            bottomButton
            activeDotStyle={{backgroundColor: Colors.primaryColor}}
            renderNextButton={this._renderNextButton}
            renderPrevButton={this._renderPreviusButton}
            renderDoneButton={this._renderDonesButton}
          />
      );
    }
  }
}