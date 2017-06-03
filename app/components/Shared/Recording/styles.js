import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  row: {
    backgroundColor: '#252626',
    borderBottomColor: '#1B1F20',
    borderBottomWidth: 2,
    height: 48,
    flexDirection: 'row',
    width: '100%',
  },
  rowContent: {
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
    width: 100,
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
