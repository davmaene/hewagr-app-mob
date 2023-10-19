import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../../screens/Home/Home.screen';
import { AntDesign, Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../assets/colors/Colors';
import { View, Image, TouchableOpacity, Animated, StyleSheet, Text, SafeAreaView } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { ProfileScreen } from '../../screens/Profile/Profilescreen';
import { Dims } from '../../assets/dimensions/Dimemensions';
import { buttons, modal, styles } from '../../assets/styles/Styles';
import GLOBAL from '../GlobalHookAndState/GlobalHookAndState';
import GLOBALP from '../GlobalHookAndStateProfile/GlobalHookAndStateProfile';

const Tab = createBottomTabNavigator();

export const TabBottom = ({ navigation }) => {

  const _renderIcon = ( routeName, selectedTab ) => {
    let icon = '';
    let size = Dims.iconsize + 3;
    switch (routeName) {
      case 'Home':
        icon = 'home';
       return <AntDesign 
          name={icon} 
          size={size} 
          color={ routeName === selectedTab ? Colors.primaryColor : Colors.inactiveColor } 
        />
        break;
      case 'Profile':
        icon = 'setting';
       return <AntDesign 
          name={icon} 
          size={size} 
          color={ routeName === selectedTab ? Colors.primaryColor : Colors.inactiveColor } 
        />
        break;
    }
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {

    GLOBAL.ScreenGlobal.setState({
      navigation: navigation
    })

    GLOBALP.ScreenGlobalProfile.setState({
      navigation: navigation
    })

  }, [ GLOBAL, GLOBALP ])

  return (
      <CurvedBottomBar.Navigator
        style={styles.bottomBar}
        strokeWidth={0.5}
        height={Dims.tabBottomHeight}
        circleWidth={50}
        bgColor={Colors.whiteColor}
        screenOptions={{
          headerShown: false
        }}
        initialRouteName="Home"
        borderTopLeftRight
        renderCircle={(d) => (
          <Animated.View style={styles.btnCircle}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
              onPress={() => {

                GLOBAL.ScreenGlobal.setState({
                  visible: !GLOBAL.ScreenGlobal.state.visible
                })

                // console.log(" Informations => ", GLOBALP);

                GLOBALP.ScreenGlobalProfile.setState({
                    visible: !GLOBALP.ScreenGlobalProfile.state.visible
                })

                // console.log("The state of your navigation ======> " ,GLOBAL.ScreenGlobal.state);
                // setspeedd(!speedd)
                // if(global.iscollecteur === 1) navigation.navigate("abonnement", { from: "home" })
                // else navigation.navigate("souscription", { from: "home" })
                
              }}>
              <Ionicons name={'add-circle-outline'} color={Colors.whiteColor} size={25} />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
      >

        <CurvedBottomBar.Screen
          name="Profile"
          component={() => <ProfileScreen navigation={navigation} />}
          position="RIGHT"
        />  
        
        <CurvedBottomBar.Screen
          name="Home"
          position="LEFT"
          component={() => <HomeScreen navigation={navigation} />}
        />

      </CurvedBottomBar.Navigator>
  );
};

