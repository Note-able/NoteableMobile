import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 40,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1B1F20',
    borderRadius: 2,
    shadowColor: '#0E1010',
    shadowOffset: { height: 5, width: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    marginBottom: 130,
    paddingHorizontal: 12,
    paddingTop: 12,
    width: '100%',
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
