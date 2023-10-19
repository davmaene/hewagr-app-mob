import 
{
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

  export const Loader = ({ size, color }) => {
    return(
        <MaterialIndicator size={size ? size : 18} color={ color ? color : Colors.whiteColor } />
    )
  }