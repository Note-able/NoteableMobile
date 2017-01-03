import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

import Conversation from '../../components/MessageList/Conversation';

const mapStateToProps = state => state;

class Messages extends Component {
    
    
    render() {
        return (
            <View style={styles.container}>
                <Conversation />
            </View>
        );
    }
}

export default connect(mapStateToProps, null)(Messages);

const styles = {
    container: {
        flex: 1,
        marginTop: 65,
        overflow: 'visible',
    },
};
