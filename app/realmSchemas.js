// import Realm from 'realm';

// Define your models and their properties

const RecordingSchema = {
  name: 'Recording',
  properties: {
    name: 'string',
    path: 'string',
    date: 'string',
    duration: 'string',
    description: 'string',
    isSynced: 'bool',
    id: 'string',
  },
};

export default {
  RecordingSchema: {
    schema: [RecordingSchema],
  },
};
