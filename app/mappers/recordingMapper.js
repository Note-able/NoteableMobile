const DisplayTime = (currentTime) => {
  let hour = Math.floor((currentTime / 360000)) % 24;
  let minute = Math.floor((currentTime / 60000)) % 60;
  let second = Math.floor((currentTime / 1000)) % 60;
  let tenth = Math.floor((currentTime / 10)) % 100;

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (minute < 10) {
    minute = `0${minute}`;
  }

  if (second < 10) {
    second = `0${second}`;
  }

  if (tenth < 10) {
    tenth = `0${tenth}`;
  }

  if (hour === '00') {
    return `${minute}:${second}.${tenth}`;
  }

  return `${hour}:${minute}:${second}.${tenth}`;
};

const MapRecordingFromDB = dbRecording => ({
  name: dbRecording.name,
  path: dbRecording.path,
  dateCreated: dbRecording.date,
  durationDisplay: DisplayTime(dbRecording.duration * 1000),
  duration: dbRecording.duration,
  description: dbRecording.description,
  id: dbRecording.id,
  isSynced: dbRecording.isSynced,
});

export {
  MapRecordingFromDB,
  DisplayTime,
};
