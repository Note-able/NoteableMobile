import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    height: 200,
  },
  header: {
    backgroundColor: '#1B1F20',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    padding: 11,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: '#111111',
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowOffset: { height: 0 },
    zIndex: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  navigateRecordings: {
    color: 'white',
    fontSize: 14,
    paddingBottom: 2,
    paddingTop: 2,
  },
  recentRecordings: {
    backgroundColor: 'transparent',
    height: 250,
    justifyContent: 'center',
    overflow: 'scroll',
    width: '100%',
  },
  row: {
    backgroundColor: '#252626',
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  rowTitle: {
    color: 'white',
  },
});
