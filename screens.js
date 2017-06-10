import Profile from './app/screens/Profile/index.js';
import Home from './app/screens/Home';
import AudioRecorder from './app/screens/AudioRecorder';
import Nearby from './app/screens/Nearby';
import Events from './app/screens/Events';
import Music from './app/screens/Music/index.js';


// Messages
import MessagesNavBar from './app/screens/Messages/MessagesNavBar';
import Messages from './app/screens/Messages';
import MessagesSearch from './app/screens/Messages/MessagesSearch';
import MessagesCreate from './app/screens/Messages/MessagesCreate';
import MessagesConversation from './app/screens/Messages/MessagesConversation';

export const appScreens = {
  Home: { screen: Home },
  Profile: { path: 'profile', screen: Profile },
  AudioRecorder: { path: 'recorder', screen: AudioRecorder },
  Nearby: { path: 'nearby', screen: Nearby },
  Events: { path: 'events', screen: Events },
  Music: { path: 'recordings', screen: Music },
  Messages: { path: 'messages', screen: Messages },
};
