//import Realm from 'realm';

// Define your models and their properties

export const RecordingSchema = {
    name: 'Recording',
    properties: {
        name: 'string',
        path: 'string',
        date: 'string',
        duration: 'string',
        description: 'string',
        isSynced: 'bool',
        id: 'string',
    }
};