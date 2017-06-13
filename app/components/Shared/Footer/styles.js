import { StyleSheet } from 'react-native';
import {
  colors,
  shadowProps,
} from '../../../styles';

export default StyleSheet.create({
  footerContainer: {
    backgroundColor: colors.shade0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    ...shadowProps,
  },
  tabsContainer: {
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingVertical: 2,
    paddingTop: 4,
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
    alignItems: 'center',
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  playerText: {
    color: colors.shade90,
    fontSize: 20,
    width: 150,
  },
  playerDetails: {
    color: colors.shade90,
    fontSize: 12,
    width: 100,
  },
  timingBar: {
    backgroundColor: colors.green,
    height: 2,
  },
});
