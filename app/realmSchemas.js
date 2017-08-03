// import Realm from 'realm';

// Define your models and their properties
// the first schema to update to is the current schema version
// since the first schema in our array is at
// open the Realm with the latest schema
import Realm from 'realm';
// import moment from 'moment';

// const recordingsMigration = (oldRealm, newRealm) => {
//   if (oldRealm.schemaVersion < 5) {
//     const oldObjects = oldRealm.objects('Recording');
//     const newObjects = newRealm.objects('Recording');

//     // loop through all objects and set the name property in the new schema
//     for (let i = 0; i < oldObjects.length; i += 1) {
//       newObjects[i].audioUrl = '';
//     }
//   }
// };

const RecordingSchemas = {
  5: {
    schemaVersion: 5,
    schema: [{
      name: 'Recording',
      primaryKey: 'id',
      properties: {
        name: 'string',
        path: 'string',
        duration: { type: 'double', optional: true },
        description: 'string',
        isSynced: 'bool',
        id: 'int',
        dateCreated: 'date',
        dateModified: 'date',
        resourceId: { type: 'int', default: 0 },
        size: { type: 'int', optional: true },
        audioUrl: 'string',
      },
    }],
  },
  // {
  //   schemaVersion: 6,
  //   schema: [{
  //     name: 'Recording',
  //     primaryKey: 'id',
  //     properties: {
  //       name: 'string',
  //       path: 'string',
  //       duration: { type: 'double', optional: true },
  //       description: 'string',
  //       isSynced: 'bool',
  //       id: 'int',
  //       dateCreated: 'date',
  //       dateModified: 'date',
  //       resourceId: { type: 'int', default: 0 },
  //       size: { type: 'int', optional: true },
  //       audioUrl: { type: 'string', default: '' },
  //     },
  //   }],
  //   migration: recordingsMigration,
  // },
};

// console.log(Realm.defaultPath);
// let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
// while (nextSchemaIndex < RecordingSchemas.length) {
//   /* eslint-disable no-plusplus */
//   const migratedRealm = new Realm(RecordingSchemas[nextSchemaIndex++]);
//   migratedRealm.close();
// }

const GetId = (realm) => {
  const result = realm.sorted('id', true);
  if (result.length === 0) {
    return 1;
  }

  return result[0].id;
};

const RecordingSchema = new Realm(RecordingSchemas[5]);

export default {
  RecordingSchema,
  GetId,
};
