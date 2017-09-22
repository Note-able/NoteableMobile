import { StyleSheet } from 'react-native';
import { colors } from '../../../styles';

export default StyleSheet.create({
  rowContent: {
    backgroundColor: colors.shade10,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 2,
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: '100%',
  },
  rowTitle: {
    color: '#95989A',
    width: 85,
  },
  rowDetails: {
    color: '#95989A',
    fontSize: 12,
    marginLeft: 8,
    width: 85,
  },
  name: {
    width: 150,
  },
  icon: {
    color: '#95989A',
  },
  rowOptions: {
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 2,
  },
});
