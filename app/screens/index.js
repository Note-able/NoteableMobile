import AudioRecorder from './AudioRecorder';
import Music from './Music/index.js';
import Settings from './Settings';
import Profile from './Profile';
import Messages from './Messages';

export const appScreens = {
  Settings: { screen: Settings },
  Recordings: { screen: Music },
  Record: { screen: AudioRecorder },
  Profile: { screen: Profile },
  Messages: { screen: Messages },
  // Nearby: { screen: Nearby },
  // Events: { screen: Events },
};
