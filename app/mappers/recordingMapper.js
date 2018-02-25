import moment from 'moment';

export const DisplayTime = currentTime => {
  let hour = Math.floor(currentTime / 360000) % 24;
  let minute = Math.floor(currentTime / 60000) % 60;
  let second = Math.floor(currentTime / 1000) % 60;
  let tenth = Math.floor(currentTime / 10) % 100;

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

export const ShortDisplayTime = currentTime => {
  let hour = Math.floor(currentTime / 360000) % 24;
  let minute = Math.floor(currentTime / 60000) % 60;
  let second = Math.floor(currentTime / 1000) % 60;

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (minute < 10) {
    minute = `0${minute}`;
  }

  if (second < 10) {
    second = `0${second}`;
  }

  if (hour === '00') {
    return `${minute}:${second}`;
  }

  return `${hour}:${minute}:${second}`;
};

/**
 *
 * @param {object} source
 *
 * audioUrl: dbMusic.audio_url,
  createdDate: dbMusic.created_date,
  coverUrl: dbMusic.cover_url,
  author: dbMusic.author,                 <-- don't care
  modifiedDate: dbMusic.modified_date,
  size: dbMusic.size,
  isDeleted: !!dbMusic.is_deleted,
  description: dbMusic.description,
  duration: dbMusic.duration,
  id: dbMusic.id,
  name: dbMusic.name,
 */

export const MapRecordingToAPI = source => ({
  createdDate: source.dateCreated,
  description: source.description,
  duration: source.duration,
  modifiedDate: source.dateModified,
  name: source.name,
  path: source.path,
  id: source.resourceId,
  isSynced: source.isSynced,
  size: source.size,
  tags: source.tags,
});

export const MapRecordingFromAPI = source => ({
  audioUrl: source.audioUrl,
  dateCreated: moment(source.createdDate).toDate(),
  dateModified: moment(source.modifiedDate).toDate(),
  description: source.description,
  duration: parseInt(source.duration === '' ? 0 : source.duration, 10),
  isSynced: true,
  name: source.name,
  resourceId: parseInt(source.id, 10),
  size: parseInt(source.size.match(/\d*/)[0] === '' ? 0 : source.size.match(/\d*/)[0], 10),
  tags: source.tags.join() || '',
});

export const MapRecordingFromDB = dbRecording => ({
  dateCreated: dbRecording.dateCreated,
  dateModified: dbRecording.dateModified,
  description: dbRecording.description,
  durationDisplay: DisplayTime(dbRecording.duration * 1000),
  duration: dbRecording.duration,
  id: dbRecording.id,
  isSynced: dbRecording.isSynced,
  name: dbRecording.name,
  audioUrl: dbRecording.audioUrl,
  path: dbRecording.path,
  resourceId: dbRecording.resourceId,
  size: dbRecording.size,
  tags: dbRecording.tags,
});

export const MapRecordingsToAssocArray = (recordingsList, mapFunc) => {
  const recordings = {
    local: {},
    networked: {},
    order: [],
  };

  recordingsList.forEach(recording => {
    if (recording.resourceId === -1) {
      recordings.local[recording.id] = mapFunc ? mapFunc(recording) : recording;
    } else {
      recordings.networked[recording.id] = mapFunc ? mapFunc(recording) : recording;
    }

    recordings.order.push(recording.id);
  });

  return recordings;
};
