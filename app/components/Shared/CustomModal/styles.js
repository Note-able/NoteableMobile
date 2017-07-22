import { StyleSheet } from 'react-native';
import { colors } from '../../../styles';

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
    backgroundColor: colors.shade0,
    borderRadius: 2,
    shadowColor: colors.shadow,
    shadowOffset: { height: 5, width: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    marginBottom: 130,
    paddingHorizontal: 12,
    paddingTop: 12,
    width: '100%',
  },
  modalTitle: {
    color: colors.shade90,
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    width: '100%',
  },
  inputField: {
    backgroundColor: colors.shade20,
    color: colors.shade140,
    height: 32,
    marginVertical: 4,
    paddingHorizontal: 4,
    paddingVertical: 0,
    width: '100%',
  },
  inputLabel: {
    color: colors.shade90,
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
