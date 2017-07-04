import AudioRecorder from './AudioRecorder';
import Music from './Music/index.js';
import Settings from './Settings';

export const appScreens = {
  Settings: { screen: Settings },
  Recordings: { screen: Music },
  Record: { screen: AudioRecorder },
  // Profile: { screen: Profile },
  // Nearby: { screen: Nearby },
  // Events: { screen: Events },
};
