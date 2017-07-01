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

export const MapRecordingFromAPI = source => ({
  name: source.name,
  path: source.audioUrl,
  dateCreated: source.createdDate,
  dateModified: source.modifiedDate,
  durationDisplay: DisplayTime(source.duration * 1000),
  duration: source.duraton,
  size: source.size,
  description: source.description,
  id: source.id,
  isSynced: true,
});

export const MapRecordingFromDB = dbRecording => ({
  name: dbRecording.name,
  path: dbRecording.path,
  dateCreated: dbRecording.dateCreated,
  dateModified: dbRecording.dateModified,
  size: dbRecording.size,
  durationDisplay: DisplayTime(dbRecording.duration * 1000),
  duration: dbRecording.duration,
  description: dbRecording.description,
  id: dbRecording.id,
  isSynced: dbRecording.isSynced,
});

export const MergeRecordings = (oldRecordings, newRecordings) => oldRecordings.map((old) => {
  const dupe = newRecordings.find(rec => rec.id === old.resourceId);
  if (dupe != null && dupe.dateModified > old.dateModified) {
    return {
      ...old,
      ...dupe,
    };
  } else if (dupe != null) {
    return {
      ...dupe,
      ...old,
    };
  }

  return old;
}).concat(newRecordings.filter(rec => oldRecordings.find(old => old.resourceId === rec.id) == null));
