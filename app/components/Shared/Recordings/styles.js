import { StyleSheet } from 'react-native';
import {
  colors,
  shadowProps,
} from '../../../styles';

export default StyleSheet.create({
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
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 40,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  modal: {
    ...shadowProps,
    backgroundColor: '#1B1F20',
    borderRadius: 2,
    marginBottom: 130,
    paddingHorizontal: 12,
    paddingTop: 12,
    height: 100,
    width: '90%',
  },
  modalTitle: {
    color: '#95989A',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    width: '100%',
  },
  inputField: {
    backgroundColor: '#2D2E2E',
    color: '#DDDDDA',
    height: 32,
    marginVertical: 4,
    paddingHorizontal: 4,
    width: '100%',
  },
  inputLabel: {
    color: '#95989A',
    fontSize: 14,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  buttonOption: {
    flex: 1,
  },
});
