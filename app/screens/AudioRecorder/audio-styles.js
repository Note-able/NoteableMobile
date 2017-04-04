import { Dimensions, StyleSheet } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timingBar: {
    alignSelf: 'flex-start',
    backgroundColor: '#31CB94',
    height: 3,
    marginTop: -1,
  },
  timingBarShadow: {
    alignSelf: 'flex-start',
    borderBottomColor: '#31CB94',
    width: WINDOW_WIDTH,
    borderBottomWidth: 1,
    height: 0,
  },
  fileName: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  fileNameInput: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  progressText: {
    fontSize: 50,
    color: '#000',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  playPauseIcon: {
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#E8163E',
    width: 80,
    height: 80,
  },
  saveButton: {
    backgroundColor: '#31CB94',
    borderRadius: 4,
    flex: 1,
    height: 50,
    padding: 4,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  cancelButton: {
    borderColor: '#E8163E',
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
    color: '#E8163E',
    textAlign: 'center',
    fontSize: 18,
  },
});
