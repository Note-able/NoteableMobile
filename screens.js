import { Navigation } from 'react-native-navigation';

import Profile from './app/screens/Profile/index.js';
import Home from './app/screens/Home';
import Music from './app/screens/Music/index.js';
import AudioRecorder from './app/screens/AudioRecorder';
import Nearby from './app/screens/Nearby';
import Events from './app/screens/Events';

// Messages
// TODO: I think these could be combined into a single Messages screen with several components instead
import MessagesNavBar from './app/screens/Messages/MessagesNavBar';
import Messages from './app/screens/Messages';
import MessagesSearch from './app/screens/Messages/MessagesSearch';
import MessagesCreate from './app/screens/Messages/MessagesCreate';
import MessagesConversation from './app/screens/Messages/MessagesConversation';

const registerScreens = (store, Provider) => {
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('Recordings', () => Music, store, Provider);
  Navigation.registerComponent('Profile', () => Profile, store, Provider);
};

export default registerScreens;
