import { StyleSheet } from 'react-native';
import {
  colors,
} from '../../../styles';

export default StyleSheet.create({
  footerContainer: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    shadowColor: colors.black,
    shadowOffset: { height: -5 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  tabsContainer: {
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingVertical: 2,
    width: '100%',
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.shade90,
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    height: 40,
  },
  player: {
    backgroundColor: colors.shade0,
  },
});
