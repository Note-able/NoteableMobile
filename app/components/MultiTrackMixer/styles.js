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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    paddingVertical: 8,
    borderTopColor: colors.mediumDark,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  removeRecording: {
    color: colors.red,
    fontSize: 14,
    textAlign: 'center',
  },
  modal: {
    backgroundColor: colors.shade0,
    marginHorizontal: 10,
    marginVertical: 100,
    overflow: 'hidden',
    borderColor: colors.mediumDark,
    borderTopWidth: 1,
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalCancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderColor: colors.white,
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  modalAddButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: colors.green,
  },
  modalButtonText: {
    color: colors.white,
  },
  modalItems: {
    backgroundColor: 'transparent',
  },
  modalRecordingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 50,
  },
});
