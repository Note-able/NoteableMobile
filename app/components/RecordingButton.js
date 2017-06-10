import React from 'react';
import { TouchableHighlight, Image } from 'react-native';

export default function RecordingButton() {
  return (
    <TouchableHighlight /* onPress={() => {  Actions.recorder();  }}*/ style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: 'transparent' }}>
      <Image source={require('../img/record.png')} style={styles.recordButton} />
    </TouchableHighlight>
  );
}

const styles = {
  recordButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
};
