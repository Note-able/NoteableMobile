export const DisplayTime = (currentTime) => {
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
  id: source.resourceId,
  isSynced: source.isSynced,
  size: source.size,
});

export const MapRecordingFromAPI = source => ({
  audioUrl: source.audioUrl,
  dateCreated: source.createdDate,
  dateModified: source.modifiedDate,
  description: source.description,
  duration: source.duraton,
  isSynced: true,
  name: source.name,
  resourceId: source.id,
  size: source.size,
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
  path: dbRecording.path || dbRecording.audioUrl,
  resourceId: dbRecording.resourceId,
  size: dbRecording.size,
});

export const MapRecordingsToAssocArray = (recordingsList, mapFunc) => {
  const recordings = {
    local: {},
    networked: {},
    order: [],
  };

  recordingsList.forEach((recording) => {
    if (recording.resourceId == null) {
      recordings.local[recording.id] = mapFunc ? mapFunc(recording) : recording;
    } else {
      recordings.networked[recording.resourceId] = mapFunc ? mapFunc(recording) : recording;
    }

    recordings.order.push(recording.resourceId || recording.id);
  });

  return recordings;
};

export const MergeRecordings = (oldRecordings, newRecordings) => {
  const recordings = oldRecordings.networked;
  newRecordings.forEach((recording) => {
    if (recordings[recording.resourceId] == null || recording.dateModified > recordings[recording.resourceId].dateModified) {
      recordings[recording.resourceId] = recording;
    } else {
      recordings[recording.resourceId].audioUrl = recording.audioUrl;
    }
  });

  return {
    ...oldRecordings,
    networked: recordings,
  };
};
