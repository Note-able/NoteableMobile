import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
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
    maxHeight: 250,
    justifyContent: 'flex-start',
    overflow: 'scroll',
    width: '100%',
  },
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
