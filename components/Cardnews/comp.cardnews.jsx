import * as React from 'react';
import { ScrollView, TouchableHighlight, View, Text, RefreshControl } from 'react-native';
import { Card, ListItem, Button, Icon, Image } from 'react-native-elements'
import { Colors } from '../../assets/colors/Colors';
import { btn } from '../../assets/styles/Styles';
import { Loader } from '../../components/Loader/comp.loader';
import { Title } from '../../components/Title/Title';

export const Cardnews = ({ navigation, route, item }) => {
    const index = Math.random() * 10;

    return(
        <Card key={index * Math.random() * Math.random()}>
            <View style={{ height: 32 }}>
                <Text style={{ fontFamily: "mons-b", textTransform: "uppercase" }}>Information</Text>
            </View>
            <View>
                <Image
                    source={{ uri: `https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg` }}
                    style={{ width: "100%", height: 140 }}
                    PlaceholderContent={<Loader />}
                />
            </View>
            <View style={{ height: "auto", paddingVertical: 10 }}>
                <Text style={{marginBottom: 10, fontFamily: "mons-e"}}>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat consequatur hic suscipit officia distinctio quis quasi maxime eveniet sapiente? Eum aperiam quos corrupti maxime aliquid libero vitae laborum dolor omnis!
                </Text>
                <TouchableHighlight
                    style={[btn]}
                >
                    <Text style={{ color: Colors.whiteColor, fontFamily: "mons" }}>Lire plus</Text>
                </TouchableHighlight>
            </View>
        </Card>
    )
}