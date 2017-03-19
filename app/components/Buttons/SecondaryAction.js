import React, { PropTypes } from 'react';
import { TouchableHighlight, Text } from 'react-native';

const SecondaryAction = ({ onPress, text, color, width, height }) => (
    <TouchableHighlight onPress={onPress} style={[styles.buttonContainer, { borderColor: color, width: width, height }]}>
        <Text style={[styles.text, { color }]}>{text}</Text>
    </TouchableHighlight>
);

SecondaryAction.propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
}

export default SecondaryAction;

const styles = {
    buttonContainer: {
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    }
};
