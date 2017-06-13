import Realm from 'realm';
import Schemas from './app/realmSchemas';

const schemaName = process.argv[2];

const realm = new Realm({
  schema: Schemas.RecordingSchema.schema,
  schemaVersion: 3,
  migration(oldRealm, newRealm) {
    const oldObjects = oldRealm.objects('Recording');
    const newObjects = newRealm.objects('Recording');

    for (let i = 0; i < oldObjects.length; i++) {
      newObjects[i].id = parseInt(oldObjects[i], 10);
    }
  },
});
// name: 'string',
//     path: 'string',
//     date: 'string',
//     duration: 'double',
//     description: 'string',
//     isSynced: 'bool',
//     id: 'int',

realm.write(() => {
  realm.create('Recording', {
    name: 'wow',
    path: 'test',
    date: 'deal',
    duration: 1.0,
    description: '',
    isSynced: false,
  });
});
