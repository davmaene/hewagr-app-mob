import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SigninScreen } from './screens/Signin/Signinscreen';
import { SignupScreen } from './screens/Signup/Signupscreen';
import { SettingScreen } from './screens/Settings/SettingScreen';
import { ProfileScreen } from './screens/Profile/Profilescreen';
import { TabBottom } from './components/Tabbottomnavigation/com.tabbottomnavigation';
import { LoadingSceen } from './screens/Loading/LoadingScreen';
import { Provider } from 'react-native-paper';
import { toastConfig } from './assets/Toast/Toastconfig';
import Toast from 'react-native-toast-message';
import { Recoverpassword } from './screens/Recoverpassword/Recoverpassword.screen';
import Introductionscreen from './screens/Introductions/Introductionsscreen';
import { Addcultivateurscreen } from './screens/Addcutivateur/Addcultivateurscreen';
import { Addchampsscreen } from './screens/Addchamps/Addchampscreen';
import { Souscription } from './screens/Souscription/Souscriptionscreen';
import { ListeAgriculteurScreen } from './screens/ListeAgriculteurs/ListeAgriculteurs';
import { DetailsAgriculteurScreen } from './screens/Detailagriculteur/Detailagriculteur';
import { ListeSouscriptionsScreen } from './screens/ListeSouscriptions/ListeSouscriptions';
import { ListeChampsScreen } from './screens/ListeChamps/ListeChamps';
import { AboutScreen } from './screens/About/AboutScreen';
import { EditprofileScreen } from './screens/Editprofile/Editprofilescreen';
import { EditagriculteurScreen } from './screens/Editagiculteur/Editagiculteurscreen';
import { DetailsChampsscreen } from './screens/Detailchamps/Detailachamps';
import { Editchampsscreen } from './screens/Editchamps/Editchampscreen';
import { DetailSouscriptionScreen } from './screens/Detailsouscription/Detailsouscriptionscreen';
import { Addzonedeproductionscreen } from './screens/Addzonedeproduction/Addzonedeproduction';
import { SynchronisationScreen } from './screens/Synchrnisationscree/Synchronisationscreen';
import { SigninAsCollectorScreen } from './screens/Signinascollector/Signinascollector';
import { LoadingAndCheckSessionSceen } from './screens/Loadingandchecksession/LoadingAndCheckingSessionScreen';
import { AbonnemetScreen } from './screens/Abonement/Abonementscreen';
import { CollectScreen } from './screens/Collect/Collectscreen';
import { ListeCollectionScreen } from './screens/ListeCollections/ListCollections';
import { DetailsCollectionScreen } from './screens/Detailagriculteur copy/DetailsCollectionScreen';
import { AbonnemetConseilAgricoleScreen } from './screens/AbonementConseilAgricole/Abonementconseilagricolescreen';
import { Changepasswordscreen } from './screens/Changepassword/Changepassword';
import { Recoverpasswordscreen } from './screens/Recoverpassword/Recoverpassword';
import { VerifyAccountOnForgetenScreen } from './screens/Verifyaccount/VerifyAccountOnForgetPasswordScreen';
import { VerifyaccountScreen } from './screens/Verifyqccount/VerifyaccountScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='loading'
          defaultScreenOptions={{
            animation: "slide_from_left",

          }}
          screenOptions={
            {
              headerShown: false,
              headerMode: "float"
            }
          }
        >
          <Stack.Screen name="loading" component={LoadingSceen} />
          <Stack.Screen name="loadingsession" component={LoadingAndCheckSessionSceen} />
          <Stack.Screen name="intros" component={Introductionscreen} />
          <Stack.Screen name="about" component={AboutScreen} />
          <Stack.Screen name="tabs" component={TabBottom} />
          <Stack.Screen name="settings" component={SettingScreen} />
          {/* ------- me ------------ */}
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="edit-profile" component={EditprofileScreen} />
          {/* ------- agri --------  */}
          <Stack.Screen name="listeagr" component={ListeAgriculteurScreen} /> 
          <Stack.Screen name="agriculteur" component={DetailsAgriculteurScreen} /> 
          <Stack.Screen name="edit-agriculteur" component={EditagriculteurScreen} />
          <Stack.Screen name="addcultivateur" component={Addcultivateurscreen} />
          {/* ------- sousc --------- */}
          <Stack.Screen name="listesousc" component={ListeSouscriptionsScreen} /> 
          <Stack.Screen name="detailsouscription" component={DetailSouscriptionScreen} /> 
          <Stack.Screen name="souscription" component={Souscription} />
          {/* ------- champs ------ */}
          <Stack.Screen name="listechamps" component={ListeChampsScreen} /> 
          <Stack.Screen name="champs" component={DetailsChampsscreen} /> 
          <Stack.Screen name="edit-champs" component={Editchampsscreen} /> 
          <Stack.Screen name="addchamps" component={Addchampsscreen} />
          {/* ------ zonde de prodction ---- */}
          <Stack.Screen name="addzone" component={Addzonedeproductionscreen} />
          {/* ------  Authentification ----- */}
          <Stack.Screen name="signin" component={SigninScreen} />
          <Stack.Screen name="signup" component={SignupScreen} />
          <Stack.Screen name="recoverpassword" component={Recoverpassword} />
          <Stack.Screen name="verifyaccount" component={VerifyaccountScreen} />
          <Stack.Screen name="verifyaccountonforgotenpassword" component={VerifyAccountOnForgetenScreen} />
          <Stack.Screen name="changepassword" component={Changepasswordscreen} />
          <Stack.Screen name="oublimotdepasse" component={Recoverpasswordscreen} />
          {/* ------- Synchronisation ------ */}
          <Stack.Screen name="sync" component={SynchronisationScreen} />
          {/* ------- Collector ------------- */}
          <Stack.Screen name="signinascollector" component={SigninAsCollectorScreen} />
          <Stack.Screen name="listecollections" component={ListeCollectionScreen} />
          <Stack.Screen name="abonnement" component={AbonnemetScreen} />
          <Stack.Screen name="collect" component={CollectScreen} />
          <Stack.Screen name="collection" component={DetailsCollectionScreen} />
          <Stack.Screen name="conseil" component={AbonnemetConseilAgricoleScreen} />

        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </Provider>
  );
};
