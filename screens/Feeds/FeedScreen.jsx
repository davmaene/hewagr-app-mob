import * as React from 'react';
import { ScrollView, TouchableHighlight, View, Text, RefreshControl } from 'react-native';
import { Card, ListItem, Button, Icon, Image } from 'react-native-elements'
import { Colors } from '../../assets/colors/Colors';
import { btn } from '../../assets/styles/Styles';
import { Cardnews } from '../../components/Cardnews/comp.cardnews';
import { Loader } from '../../components/Loader/comp.loader';
import { Title } from '../../components/Title/Title';

const users = [
    {
       name: 'brynn',
       avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
    {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
    {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
    {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
    {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
    {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
]

export const FeedScreen = ({ navigation, route }) => {

    return(
        <>
            <Title navigation={undefined} title={"Informations"} subtitle={"Nouvelles et informations"} />
            <ScrollView
                style={{ alignContent: "center", alignSelf: "center", width: "99%" }}
                contentContainerStyle={{paddingBottom: "15%"}}
                refreshControl={
                    <RefreshControl
                        colors={[ Colors.primaryColor, Colors.secondaryColor ]}
                    />
                }
            >
                {users.map((element, index) => (
                    <Cardnews navigation={navigation} item={element} key={Math.random() * Math.random()} />
                ))}
            </ScrollView>
        </>
    )
}