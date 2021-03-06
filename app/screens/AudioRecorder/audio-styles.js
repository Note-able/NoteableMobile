import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../styles';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: colors.shade0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
    width: WINDOW_WIDTH,
    height: '100%',
  },
  timingBar: {
    alignSelf: 'flex-end',
    backgroundColor: colors.green,
    height: 3,
  },
  recordingBar: {
    alignSelf: 'flex-start',
    backgroundColor: colors.green,
    height: 3,
    width: 1,
  },
  timingBarShadow: {
    alignSelf: 'flex-end',
    borderBottomColor: colors.green,
    width: WINDOW_WIDTH,
    borderBottomWidth: 1,
    height: 0,
  },
  fileName: {
    borderColor: colors.white,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 100,
    marginRight: 20,
    marginLeft: 20,
    height: 28,
  },
  fileNameInput: {
    color: colors.white,
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  progressText: {
    backgroundColor: 'transparent',
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    width: 87,
  },
  recordButton: {
    backgroundColor: colors.recordingRed,
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  playPauseIcon: {
    flex: 1,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
  },
  stopButton: {
    backgroundColor: colors.recordingRed,
    height: 60,
    width: 60,
  },
  saveButton: {
    backgroundColor: colors.green,
    borderRadius: 4,
    flex: 1,
    height: 50,
    padding: 4,
    paddingHorizontal: 50,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
  },
  cancelButton: {
    borderColor: colors.recordingRed,
    borderWidth: 1,
    borderRadius: 4,
    flex: 1,
    height: 50,
    padding: 4,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.recordingRed,
    textAlign: 'center',
    fontSize: 18,
  },
  navBar: {
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.recordingRed,
    height: 50,
  },
  navTitle: {
    padding: 10,
    color: colors.white,
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    height: 100,
    padding: 20,
    width: '100%',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    marginHorizontal: 20,
  },
  saveContainer: {
    width: 200,
    height: 40,
    marginTop: 10,
    marginBottom: 50,
  },
  progressTextContainer: {
    height: 40,
    justifyContent: 'center',
  },
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
  recordingsContainer: {
    height: 200,
    width: '100%',
  },
  header: {
    backgroundColor: colors.shade0,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    padding: 11,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: colors.shadow,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowOffset: { height: 0 },
  },
  headerText: {
    color: colors.white,
    fontSize: 18,
  },
  navigateRecordings: {
    color: colors.white,
    fontSize: 14,
    paddingBottom: 2,
    paddingTop: 2,
  },
  metronomeMenuContainer: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    paddingHorizontal: 20,
  },
  metronomeMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
  },
  metronomeOnText: {
    color: colors.green,
  },
  metronomeLabel: {
    color: colors.white,
    fontSize: 14,
    padding: 10,
  },
  metronomeInput: {
    marginLeft: -10,
    width: 50,
    fontSize: 16,
    color: colors.white,
  },
});
