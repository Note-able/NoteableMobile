import React from 'react';
import { ScrollView, View, Text, TouchableHighlight } from 'react-native';

const MessageList = ({conversations}) => {
    const list = Object.keys(conversations).map((id) => {
        const conversation = conversations[id];
        return (
            <View>
                <Image></Image>
                <View style={{flexDirection: 'column'}}>
                    <Text></Text>
                    <Text></Text>
                </View>
                <Text><Text>
            </View>);
    });
    return (
        <ScrollView>
            {list}
        </ScrollView>
    );
}
