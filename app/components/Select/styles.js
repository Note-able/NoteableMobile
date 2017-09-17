import { StyleSheet } from 'react-native';
import { colors } from '../../styles/index';

const styles = StyleSheet.create({
  modal: {
    margin: 40,
    height: 400,
    borderColor: colors.mediumDark,
    borderWidth: 1,
    borderRadius: 4,
  },
  modalItems: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.dark,
    width: '100%',
  },
  modalItem: {
    color: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    borderBottomColor: colors.mediumDark,
    borderWidth: StyleSheet.hairlineWidth,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  selectText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default styles;
