import * as React from 'react';
import { View, Text, StatusBar, Image } from 'react-native';
import * as Fonts from 'expo-font';
import { onRunRemoveQRY, onRunRetrieveQRY } from '../../services/communications';
import { Loader } from '../../components/Loader/comp.loader';
import { appname } from '../../assets/configs/configs';
import { Colors } from '../../assets/colors/Colors';
import { SpeedDialCustomer } from '../../components/SpeedDial/SpeedDialCustomer';
import { SpeedDialProfileCustomer } from '../../components/SpeedDialProfile/SpeedDialProfileComponent';
// import { Image } from 'react-native-elements';

export const LoadingSceen = ({ navigation }) => {

    const [ appready, setappready ] = React.useState(false);

    const loadFonts = async () => {
      // navigation.replace("loadingsession");
      await Fonts.loadAsync({
        "mons-e": require("../../assets/fonts/MontserratAlternates-ExtraLight.ttf"),
        "mons-a": require("../../assets/fonts/MontserratAlternates-Bold.ttf"),
        "mons": require("../../assets/fonts/MontserratAlternates-SemiBold.ttf"),
        "mons-b": require("../../assets/fonts/Montserrat-SemiBold.ttf")
      });

      await onRunRetrieveQRY({ table: "__tbl_user", limit: 1 }, (er, done) => {
        if(done && done['length'] > 0){
          const u = done[0];
          global.user = u;
          global.iscollecteur = u['iscollector'];
          navigation.replace("loadingsession", { as: u['iscollector']});
        }else navigation.replace("signin");
      });
      // setappready(true);
    };
  
    React.useEffect(() => {
        loadFonts();
    }, []);

    return(
      <View style={{flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar barStyle={"light-content"} backgroundColor={ Colors.primaryColor } />
        <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", marginTop: 100 }}>
          <Image 
            // PlaceholderContent={<Loader />} 
            source={require("../../assets/icon.png")}
            style={{ resizeMode: "contain", width: 210, height: 210, marginBottom: 20, backgroundColor: Colors.whiteColor }}
          />
          <Loader size={32} color={Colors.primaryColor} />
        </View>
        <View style={{position: "absolute", bottom: "2%", width: "98%"}}>
          <Text style={{ textAlign: "center", fontSize: 11 }}>&copy; {appname} | {appname} {new Date().getFullYear()} </Text>
        </View>
        <SpeedDialCustomer />
        <SpeedDialProfileCustomer />
      </View>
    )
}