import Sound from 'react-native-sound';
import { PlayerActionTypes } from './ActionTypes.js';

const {
  startPlayerTypes,
  togglePlayerTypes,
} = PlayerActionTypes;

export const startPlayer = recording => (
  (dispatch) => {
    dispatch({ type: startPlayerTypes.processing });

    const sound = new Sound(recording.path, '', (error) => {
      if (error) {
        return dispatch({ type: startPlayerTypes.error, error });
      }

      return dispatch({ type: startPlayerTypes.success, sound, recording });
    });
  }
);

export const togglePlayer = play => (dispatch => dispatch({ type: togglePlayerTypes, play }));
