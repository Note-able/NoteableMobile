import { StyleSheet } from 'react-native';
import {
  colors,
  shadowProps,
} from '../../../styles';

export default StyleSheet.create({
  footerContainer: {
    backgroundColor: colors.shade0,
    width: '100%',
    ...shadowProps,
  },
  tabsContainer: {
    alignItems: 'center',
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
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
    height: 44,
    flex: 1,
    justifyContent: 'center',
  },
  player: {
    alignItems: 'center',
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    height: 44,
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
