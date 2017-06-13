import Profile from './Profile/index.js';
import Home from './Home';
import AudioRecorder from './AudioRecorder';
import Nearby from './Nearby';
import Events from './Events';
import Music from './Music/index.js';

export const appScreens = {
  Settings: { screen: AudioRecorder },
  Recordings: { screen: Music },
  Record: { screen: AudioRecorder },
  // Profile: { screen: Profile },
  // Nearby: { screen: Nearby },
  // Events: { screen: Events },
};
