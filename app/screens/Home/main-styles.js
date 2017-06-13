import { StyleSheet } from 'react-native';
import {
  colors,
} from '../../styles';

export default styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: colors.shade0,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  optionText: {
    fontSize: 50,
    color: 'white',
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
