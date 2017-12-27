import { StyleSheet } from 'react-native';
import {
  colors,
} from '../../styles';

export default StyleSheet.create({
  row: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderBottomWidth: 1,
    height: 56,
    flexDirection: 'row',
  },
  rowOptions: {
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    height: 56,
  },
  multiTrackHeader: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  multiTrackHeaderControl: {
    fontSize: 16,
    color: 'white',
    width: 75,
    margin: 'auto',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 4,
    alignItems: 'center',
    textAlign: 'center',
  },
  removeRecording: {
    color: colors.red,
    fontSize: 14,
    textAlign: 'center',
  },
});
