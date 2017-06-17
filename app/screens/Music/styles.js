import { Dimensions, StyleSheet } from 'react-native';
import {
  colors,
  shadowProps,
} from '../../styles';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  recordingsContainer: {
    backgroundColor: colors.shade0,
    height: '100%',
    marginTop: 20,
  },
  headerBar: {
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    height: 68,
    justifyContent: 'space-between',
    padding: 11,
    paddingTop: 30,
    paddingHorizontal: 20,
    ...shadowProps,
    top: -20,
    marginBottom: -20,
    zIndex: 4,
  },
  sortOptions: {
    width: 40,
  },
  searchInput: {
    backgroundColor: colors.shade20,
    borderRadius: 2,
    height: 28,
    width: WINDOW_WIDTH - 100,
  },
  input: {
    color: colors.shade140,
    fontSize: 14,
    height: 28,
    paddingHorizontal: 6,
    width: '100%',
  },
  filterContainer: {
    backgroundColor: colors.shade0,
    height: 0,
    left: 20,
    overflow: 'hidden',
    position: 'absolute',
    top: 48,
    width: 110,
    zIndex: 5,
  },
  filterOption: {
    borderBottomWidth: 2,
    borderBottomColor: colors.shade10,
    justifyContent: 'center',
    height: 40,
    paddingLeft: 12,
    paddingRight: 6,
  },
});
