import { Actions } from 'react-native-router-flux';

const views = {
  nearby: { colors: ['rgba(49,203,148, 0.5)', 'rgba(24,117,220,0.5)'], name: 'Nearby', scene: () => { Actions.nearby(); } },
  people: { colors: ['rgba(138,50,217, 0.5)', 'rgba(217,58,100,0.5)'], name: 'People', scene: () => { Actions.profile(); } },
  messages: { colors: ['rgba(53,116,218, 0.5)', 'rgba(138,50,217,0.5)'], name: 'Messages', scene: () => { Actions.messages(); } },
  events: { colors: ['rgba(240,166,62, 0.5)', 'rgba(234,207,63,0.5)'], name: 'Events', scene: () => { Actions.events(); } },
  music: { colors: ['rgba(217,58,100, 0.5)', 'rgba(240,166,62,0.5)'], name: 'Music', scene: () => { Actions.music(); } },
};

export default views;
