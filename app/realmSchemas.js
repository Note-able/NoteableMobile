// import Realm from 'realm';

// Define your models and their properties

const RecordingSchema = {
  name: 'Recording',
  properties: {
    name: 'string',
    path: 'string',
    date: 'string',
    duration: 'double',
    description: 'string',
    isSynced: 'bool',
    id: 'string',
  },
};

const GetId = (realm) => {
  const result = realm.sorted('id', true);
  if (result.length === 0) {
    return 1;
  }

  return result[0].id;
};

export default {
  RecordingSchema: {
    schema: [RecordingSchema],
  },
  GetId,
};
