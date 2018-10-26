import * as React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Animated,
} from 'react-native';
import { Select } from '../../components';
import styles from '../../screens/AudioRecorder/audio-styles.js';
import timeSignatures from './time-signatures';

const WINDOW_WIDTH = Dimensions.get('window').width;
export const metronomeStates = {
  off: 'Off',
  countIn: 'Count In',
  always: 'Always on',
};

export class MetronomeMenu extends React.PureComponent {
  render() {
    const {
      metronomeMenuVisible,
      showMetronomeMenu,
      metronomeMenuWidth,
      metronomeMenuHeight,
      metronomeState,
      metronomeBPM,
      countIn,
      timeSignature,
      onMetronomeStateChange,
      onBPMChange,
      onCountInChange,
      onTimeSigantureChange,
    } = this.props;

    return (
      <View style={{ height: 50, width: WINDOW_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={[
            styles.metronomeMenuContainer,
            { width: metronomeMenuWidth, height: metronomeMenuHeight },
          ]}
        >
          {showMetronomeMenu && (
            <View style={[styles.metronomeMenu, { opacity: metronomeMenuVisible ? 1 : 0 }]}>
              <TouchableHighlight
                onPress={onMetronomeStateChange}
                style={styles.metronomeMenuTouchableHighlight}
              >
                <Text
                  style={[
                    styles.metronomeLabel,
                    metronomeState !== metronomeStates.off ? styles.metronomeOnText : null,
                    { width: 90 },
                  ]}
                >
                  {metronomeState}
                </Text>
              </TouchableHighlight>
              <Text style={styles.metronomeLabel}>BPM:</Text>
              <TextInput
                onChangeText={onBPMChange}
                value={metronomeBPM}
                style={styles.metronomeInput}
                underlineColorAndroid="transparent"
              />
              <Text style={styles.metronomeLabel}>Count In:</Text>
              <TextInput
                onChangeText={onCountInChange}
                value={countIn}
                style={styles.metronomeInput}
                underlineColorAndroid="transparent"
              />
              <Select
                onValueChange={onTimeSigantureChange}
                selectedValue={timeSignature}
                options={timeSignatures}
              />
            </View>
          )}
        </Animated.View>
      </View >
    );
  }
}
