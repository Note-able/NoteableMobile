import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect, assert } from 'chai';
import fetch from 'node-fetch';
import './mock.js';
import { RecordingActionTypes, SystemActionTypes } from '../../app/actions/ActionTypes';
import { fakeRecordings, fakeResult as res, fakeAddRecording } from './defaults';
import {
  addRecording,
  deleteRecording,
  fetchRecordings,
  syncDownRecordings,
  updateRecording,
  getRecordingTitle,
} from '../../app/actions/recordingActions';

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

  beforeEach(() => {
    fakeResult = {
      ...fakeResult,
      order: fakeResult.order.sort((a, b) => b - a),
    };
  });

  it('Gets the default recording title', () => {
    expect(getRecordingTitle()).equals(1);
  });

  it('makes sure window.fetch is the one from the polyfill', () => {
    expect(typeof fetch).equals('function');
  });

  describe('Sync', () => {
    describe('On wifi', () => {
      const mockState = {
        SystemReducer: {
          network: {
            connected: 'wifi',
          },
        },
      };

      it('Sync down recordings', () => {
        const expectedActions = [
            { type: syncDownRecordingsTypes.processing },
            { type: syncDownRecordingsTypes.success, recordings: fakeResult },
        ];
        const store = mockStore(mockState);

        nock('https://beta.noteable.me').intercept('/api/v1/recordings?offset=0', 'GET').reply(200, fakeRecordings);
        nock('https://beta.noteable.me').intercept('/api/v1/recordings?offset=20', 'GET').reply(200, []);

        return store.dispatch(syncDownRecordings()).then(() => {
          const result = store.getActions();
          assert.deepEqual(result, expectedActions, JSON.stringify(result) === JSON.stringify(expectedActions));
        });
      });

      it('Sync down forbidden', () => {
        const expectedActions = [
            { type: syncDownRecordingsTypes.processing },
            { type: syncDownRecordingsTypes.error, error: '403' },
        ];
        const store = mockStore(mockState);

        nock('https://beta.noteable.me').intercept('/api/v1/recordings?offset=0', 'GET').reply(403, {});

        return store.dispatch(syncDownRecordings()).then(() => {
          const result = store.getActions();
          assert.deepEqual(result, expectedActions, JSON.stringify(result) === JSON.stringify(expectedActions));
        });
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
          assert.deepEqual(result, expectedActions, JSON.stringify(result) === JSON.stringify(expectedActions));
        });
      });
    });
  });

  describe('Fetch recordings', () => {
    it('with no sort', () => {
      const expectedActions = [
          { type: fetchRecordingsTypes.processing },
          { type: fetchRecordingsTypes.success, recordings: fakeResult },
      ];
      const store = mockStore();

      return store.dispatch(fetchRecordings()).then(() => {
        const result = store.getActions();
        assert.deepEqual(result, expectedActions, JSON.stringify(result));
      });
    });

    it('sorted by date', () => {
      const expectedActions = [
              { type: fetchRecordingsTypes.processing },
              { type: fetchRecordingsTypes.success, recordings: fakeResult },
      ];
      const store = mockStore();

      return store.dispatch(fetchRecordings('date')).then(() => {
        const result = store.getActions();
        assert.deepEqual(result, expectedActions, JSON.stringify(result));
      });
    });

    it('sorted by size', () => {
      const expectedActions = [
        { type: fetchRecordingsTypes.processing },
        {
          type: fetchRecordingsTypes.success,
          recordings: { ...fakeResult, order: fakeResult.order.sort((a, b) => fakeResult.networked[`${a}`].size - fakeResult.networked[`${b}`].size) },
        },
      ];
      const store = mockStore();

      return store.dispatch(fetchRecordings('size')).then(() => {
        const result = store.getActions();
        assert.deepEqual(result, expectedActions);
      });
    });

    it('filtered by search [assumes names are char unique]', () => {
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

      return store.dispatch(fetchRecordings(null, fakeResult.networked[fakeResult.order[0]].name)).then(() => {
        const result = store.getActions();
        assert.deepEqual(result, expectedActions);
      });
    });
  });

  describe('Create recording', () => {
    it('Adds a local recording', () => {
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

      return store.dispatch(addRecording(fakeAddRecording)).then(() => {
        const result = store.getActions();
        assert.deepEqual(result, expectedActions);
      });
    });
  });
});
