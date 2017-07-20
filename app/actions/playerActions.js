import Sound from 'react-native-sound';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import {
  DeviceEventEmitter,
} from 'react-native';
import { PlayerActionTypes } from './ActionTypes.js';

const {
  startPlayerTypes,
  togglePlayerTypes,
} = PlayerActionTypes;

const checkStatus = () => {
  ReactNativeAudioStreaming.getStatus((error, status) => {
    console.log(error);
    console.log('Status', status);
  });
  setTimeout(checkStatus, 500);
};

export const startPlayer = recording => (
  (dispatch) => {
    dispatch({ type: startPlayerTypes.processing });
    if (recording.path !== '') {
      const sound = new Sound(recording.path, '', (error) => {
        if (error) {
          return dispatch({ type: startPlayerTypes.error, error });
        }

        return dispatch({ type: startPlayerTypes.success, sound, recording });
      });
    } else {
      const sound = {
        play: (callback) => {
          ReactNativeAudioStreaming.play(recording.audioUrl, { showIniOSMediaCenter: true, showInAndroidNotifications: true });
          DeviceEventEmitter.addListener(
            'AudioBridgeEvent', (evt) => {
              console.log(evt);
                // We just want meta update for song name
              if (evt.status === 'STOPPED') {
                callback();
              }
            },
          );
        },
        stop: () => {
          ReactNativeAudioStreaming.stop();
        },
        resume: () => {
          ReactNativeAudioStreaming.resume();
        },
        pause: () => {
          ReactNativeAudioStreaming.pause();
        },
        release: () => {
          ReactNativeAudioStreaming.stop();
        },
      };

      return dispatch({ type: startPlayerTypes.success, sound, recording });
    }
  }
);

export const togglePlayer = play => (dispatch => dispatch({ type: togglePlayerTypes, play }));
