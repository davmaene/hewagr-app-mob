import * as React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Colors } from '../colors/Colors';

export const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors.successColor }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 12,
          fontWeight: '400'
        }}
      />
    ),
    info: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: Colors.primaryColor }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontWeight: '400',
          fontSize: 16
        }}
        text2Style={{
          fontSize: 12
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: Colors.dangerColor }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontWeight: '400',
          fontSize: 16
        }}
        text2Style={{
          fontSize: 12
        }}
      />
    ),
    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    )
};