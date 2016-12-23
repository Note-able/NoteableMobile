import { ActionConst, Actions } from 'react-native-router-flux'
import { combineReducers } from 'redux';

const DEFAULT_STATE = {scene: {}};
const sceneReducer = (state = DEFAULT_STATE, {type, scene}) => {
  switch(type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS:
      return {
        ...state,
        scene,
      }
    default:
      return state
  }
};

export const appReducer = combineReducers({
    sceneReducer,
});