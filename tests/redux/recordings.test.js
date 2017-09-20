import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect, assert } from 'chai';
import fetch from 'node-fetch';
import './mock.js';
import Schemas from '../../app/realmSchemas';
import { RecordingActionTypes, SystemActionTypes } from '../../app/actions/ActionTypes';
import { fakeRecordings, fakeResult as res, fakeAddRecording, fakeNetworkedRecording } from './defaults';
import {
  addRecording,
  deleteRecording,
  fetchRecordings,
  syncDownRecordings,
  updateRecording,
  getRecordingTitle,
} from '../../app/actions/recordingActions';

const realm = Schemas.RecordingSchema;
const {
  networkPreferencesFailureType,
  queueNetworkRequestType,
} = SystemActionTypes;

const {
  deleteRecordingTypes,
  downloadRecordingTypes,
  fetchRecordingsTypes,
  logoutRecordingType,
  updateRecordingTypes,
  uploadRecordingTypes,
  removeRecordingErrorType,
  saveRecordingsTypes,
  syncDownRecordingsTypes,
} = RecordingActionTypes;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
global.fetch = fetch;
let fakeResult = res;

/* eslint-disable no-undef */
// {"local":{},"networked":{"2":{"dateCreated":"2017-09-07T04:57:20.000Z","dateModified":"2017-09-07T04:57:20.000Z","description":"","durationDisplay":"00:00.00","duration":0,"id":2,"isSynced":true,"name":"Testing","audioUrl":"https://storage.googleapis.com/noteable-audio-storage/1504760239757d3ca571a-009f-9967-40f3-ed925f9729ec.aac","path":"","resourceId":35,"size":9517,"tags":""},"3":{"dateCreated":"2017-09-07T04:59:17.000Z","dateModified":"2017-09-07T04:59:17.000Z","description":"","durationDisplay":"00:00.00","duration":0,"id":3,"isSynced":true,"name":"Testing","audioUrl":"https://storage.googleapis.com/noteable-audio-storage/1504760356748af00e702-295a-bd63-2c4f-99f2b438ddde.aac","path":"","resourceId":36,"size":9516,"tags":""}},"order":[3,2]}}
// {"local":{},"networked":{"2":{"dateCreated":"2017-09-07T04:57:20.000Z","dateModified":"2017-09-07T04:57:20.000Z","description":"","durationDisplay":"00:00.00","duration":0,"id":2,"isSynced":true,"name":"Testing","audioUrl":"https://storage.googleapis.com/noteable-audio-storage/1504760239757d3ca571a-009f-9967-40f3-ed925f9729ec.aac","path":"","resourceId":35,"size":9516,"tags":""},"3":{"dateCreated":"2017-09-07T04:59:17.000Z","dateModified":"2017-09-07T04:59:17.000Z","description":"","durationDisplay":"00:00.00","duration":0,"id":3,"isSynced":true,"name":"Testing","audioUrl":"https://storage.googleapis.com/noteable-audio-storage/1504760356748af00e702-295a-bd63-2c4f-99f2b438ddde.aac","path":"","resourceId":36,"size":9516,"tags":""}},"order":[3,2]}}

describe('Recordings actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('Gets the default recording title', () => {
    expect(getRecordingTitle()).equals(1);
  });

  it('makes sure window.fetch is the one from the polyfill', () => {
    expect(typeof fetch).equals('function');
  });

  describe('Sync', () => {
    beforeEach(() => {
      fakeResult = {
        ...fakeResult,
        order: fakeResult.order.sort((a, b) => b - a),
      };

      realm.write(() => {
        const recordings = realm.objects('Recording');
        realm.delete(recordings);
      });
    });

    describe('On wifi', () => {
      const mockState = {
        SystemReducer: {
          network: {
            connected: 'wifi',
          },
        },
      };

      it('Sync down recordings', async () => {
        const expectedActions = [
            { type: syncDownRecordingsTypes.processing },
            { type: syncDownRecordingsTypes.success, recordings: fakeResult },
        ];
        const store = mockStore(mockState);

        nock('https://beta.noteable.me').intercept('/api/v1/recordings?offset=0', 'GET').reply(200, fakeRecordings);
        nock('https://beta.noteable.me').intercept('/api/v1/recordings?offset=20', 'GET').reply(200, []);

        await store.dispatch(syncDownRecordings());
        assert.deepEqual(store.getActions(), expectedActions);
      });

      it('Sync down forbidden', async () => {
        const expectedActions = [
            { type: syncDownRecordingsTypes.processing },
            { type: syncDownRecordingsTypes.error, error: '403' },
        ];
        const store = mockStore(mockState);

        nock('https://beta.noteable.me').intercept('/api/v1/recordings?offset=0', 'GET').reply(403, {});

        await store.dispatch(syncDownRecordings());
        assert.deepEqual(store.getActions(), expectedActions);
      });
    });

    describe('On cellular', () => {
      const mockState = {
        SystemReducer: {
          network: {
            connected: 'none',
          },
        },
      };

      it('Sync down fails without network', () => {
        const expectedActions = [{ type: queueNetworkRequestType, request: syncDownRecordingsTypes.queue }];
        const store = mockStore(mockState);

        return store.dispatch(syncDownRecordings()).then(() => {
          const result = store.getActions();
          assert.deepEqual(result, expectedActions);
        });
      });
    });
  });

  describe('Fetch recordings', () => {
    beforeEach(() => {
      fakeResult = {
        ...fakeResult,
        order: fakeResult.order.sort((a, b) => b - a),
      };

      realm.write(() => {
        const recordings = realm.objects('Recording');
        realm.delete(recordings);
        fakeResult.order.forEach((key) => {
          realm.create('Recording', fakeResult.networked[key]);
        });
      });
    });

    it('with no sort', async () => {
      const expectedActions = [
          { type: fetchRecordingsTypes.processing },
          { type: fetchRecordingsTypes.success, recordings: fakeResult },
      ];
      const store = mockStore();

      await store.dispatch(fetchRecordings());
      assert.deepEqual(store.getActions(), expectedActions);
    });

    it('sorted by date', async () => {
      const expectedActions = [
              { type: fetchRecordingsTypes.processing },
              { type: fetchRecordingsTypes.success, recordings: fakeResult },
      ];
      const store = mockStore();

      await store.dispatch(fetchRecordings('date'));
      assert.deepEqual(store.getActions(), expectedActions);
    });

    it('sorted by size', async () => {
      const expectedActions = [
        { type: fetchRecordingsTypes.processing },
        {
          type: fetchRecordingsTypes.success,
          recordings: { ...fakeResult, order: fakeResult.order.sort((a, b) => fakeResult.networked[`${a}`].size - fakeResult.networked[`${b}`].size) },
        },
      ];
      const store = mockStore();

      await store.dispatch(fetchRecordings('size'));
      assert.deepEqual(store.getActions(), expectedActions);
    });

    it('filtered by search [assumes names are char unique]', async () => {
      const expectedActions = [
        { type: fetchRecordingsTypes.processing },
        {
          type: fetchRecordingsTypes.success,
          recordings: {
            ...fakeResult,
            networked: {
              [fakeResult.order[0]]: fakeResult.networked[fakeResult.order[0]],
            },
            order: [fakeResult.order[0]],
          },
        },
      ];
      const store = mockStore();

      await store.dispatch(fetchRecordings(null, fakeResult.networked[fakeResult.order[0]].name));
      assert.deepEqual(store.getActions(), expectedActions);
    });
  });

  describe('Create recording', () => {
    it('Adds a local recording', async () => {
      const expectedActions = [
        { type: saveRecordingsTypes.processing },
        {
          type: saveRecordingsTypes.success,
          recordings: {
            ...fakeResult,
            local: {
              ...fakeResult.local,
              [fakeAddRecording.id]: fakeAddRecording,
            },
            order: [fakeAddRecording.id, ...fakeResult.order],
          },
        },
      ];
      const store = mockStore({});

      await store.dispatch(addRecording(fakeAddRecording));
      assert.deepEqual(store.getActions(), expectedActions);
    });

    it('Fails to add an invalid recording', async () => {
      const expectedActions = [
        { type: saveRecordingsTypes.processing },
        { type: saveRecordingsTypes.error, error: 'Recording.id must be of type: number' },
      ];
      const store = mockStore({});

      await store.dispatch(addRecording({ ...fakeAddRecording, id: null }));
      assert.deepEqual(store.getActions(), expectedActions);
    });
  });

  describe('Delete recording', () => {
    beforeEach(() => {
      fakeResult = {
        ...fakeResult,
        order: fakeResult.order.sort((a, b) => b - a),
      };

      realm.write(() => {
        const recordings = realm.objects('Recording');
        realm.delete(recordings);
        fakeResult.order.forEach((key) => {
          realm.create('Recording', fakeResult.networked[key]);
        });
        realm.create('Recording', fakeAddRecording);
      });
    });

    const mockState = {
      SystemReducer: {
        network: {
          connected: 'wifi',
        },
      },
    };

    it('Deletes a local recording', async () => {
      const expectedActions = [
        { type: deleteRecordingTypes.processing },
        { type: deleteRecordingTypes.success, deletedId: fakeAddRecording.id },
      ];
      const store = mockStore({});

      await store.dispatch(deleteRecording(fakeAddRecording));
      assert.deepEqual(store.getActions(), expectedActions);
    });

    it('Fails to delete a local recording', async () => {
      const expectedActions = [
        { type: deleteRecordingTypes.processing },
        { type: deleteRecordingTypes.error, error: 'Failed delete' },
      ];
      const store = mockStore({});

      await store.dispatch(deleteRecording({ id: 5, isSynced: false }));
      assert.deepEqual(store.getActions(), expectedActions);
    });

    it('Deletes a networked recording', async () => {
      const expectedActions = [
        { type: deleteRecordingTypes.processing },
        { type: deleteRecordingTypes.success, deletedId: fakeResult.order[0] },
      ];
      const store = mockStore(mockState);
      const recording = fakeResult.networked[fakeResult.order[0]];

      nock('https://beta.noteable.me').intercept(`/api/v1/recordings/${recording.resourceId}`, 'DELETE').reply(204, {});

      await store.dispatch(deleteRecording(recording));
      assert.deepEqual(store.getActions(), expectedActions);
    });

    it('Fails request to delete a networked recording', async () => {
      const expectedActions = [
        { type: deleteRecordingTypes.processing },
        { type: deleteRecordingTypes.error, error: 'Failed delete' },
      ];
      const store = mockStore(mockState);
      const recording = fakeResult.networked[fakeResult.order[0]];

      nock('https://beta.noteable.me').intercept(`/api/v1/recordings/${recording.resourceId}`, 'DELETE').reply(404, {});

      await store.dispatch(deleteRecording(recording));
      assert.deepEqual(store.getActions(), expectedActions);
    });
  });

  describe('Update recording', () => {
    beforeEach(() => {
      fakeResult = {
        ...fakeResult,
        order: fakeResult.order.sort((a, b) => b - a),
      };

      realm.write(() => {
        const recordings = realm.objects('Recording');
        realm.delete(recordings);
        fakeResult.order.forEach((key) => {
          realm.create('Recording', fakeResult.networked[key]);
        });
        realm.create('Recording', fakeAddRecording);
      });
    });

    const mockState = {
      SystemReducer: {
        network: {
          connected: 'wifi',
        },
      },
    };

    it('updates a local recording', () => {});
    it('fails to update a missing recording', () => {});
    it('updates a networked recording', () => {});
    it('fails to update a missing networked recording', () => {});
    it('fails to update a networked recording without a connection', () => {});
  });
});
