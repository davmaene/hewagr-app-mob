import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
import { Colors } from '../../assets/colors/Colors';

  export const Loaderonsignalsent = ({ size, color }) => {
    return(
        <PulseIndicator size={size ? size : 18} color={ color ? color : Colors.whiteColor } />
    )
  }