import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';
import fetch from 'node-fetch';

import {
  registerUser,
  signInLocal,
} from '../../app/actions/accountActions';
import { AccountActionTypes } from '../../app/actions/ActionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

/* eslint-disable no-undef */
jest.mock('react-native-fabric', () => ({}));
jest.mock('react-native-fetch-blob', () => ({
  fs: { dirs: { DocumentDir: '' } },
}));

describe('Account actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  beforeEach(() => { global.fetch = fetch; });

  it('makes sure window.fetch is the one from the polyfill', () => {
    expect(typeof fetch).equals('function');
  });

  it('Passes registration', () => {
    nock('https://beta.noteable.me')
      .intercept('/api/v1/register', 'POST')
      .reply(200, { success: true });

    const registration = { firstName: 'Michael', lastName: 'Nakayama', email: 'sportnak@gmail.com', password: 'password' };
    const expectedActions = [
      { type: AccountActionTypes.registerUserTypes.processing },
      { type: AccountActionTypes.registerUserTypes.success, registration, result: { success: true } },
    ];
    const store = mockStore({});

    return store.dispatch(registerUser(registration)).then(() => {
      expect(JSON.stringify(store.getActions())).equals(JSON.stringify(expectedActions));
    });
  });

  it('Fails registration', () => {
    nock('https://beta.noteable.me')
      .intercept('/api/v1/register', 'POST')
      .reply(400, { });

    const registration = { firstName: 'Michael', lastName: 'Nakayama', email: 'sportnak@gmail.com', password: 'password' };
    const expectedActions = [
      { type: AccountActionTypes.registerUserTypes.processing },
      { type: AccountActionTypes.registerUserTypes.error, error: {} },
    ];
    const store = mockStore({});

    return store.dispatch(registerUser(registration)).then(() => {
      expect(JSON.stringify(store.getActions())).equals(JSON.stringify(expectedActions));
    });
  });

  it('Succeeds login', () => {
    nock('https://beta.noteable.me')
      .intercept('/auth/local/jwt', 'POST')
      .reply(200, { });

    const expectedActions = [
      { type: AccountActionTypes.fetchSignInTypes.processing },
      { type: AccountActionTypes.fetchSignInTypes.success },
    ];
    const store = mockStore({});

    return store.dispatch(signInLocal('sportnak@gmail.com', 'password')).then(() => {
      expect(JSON.stringify(store.getActions())).equals(JSON.stringify(expectedActions));
    });
  });

  it('Fails login', () => {
    const expectedActions = [
      { type: AccountActionTypes.fetchSignInTypes.processing },
      { type: AccountActionTypes.fetchSignInTypes.error, error: {} },
    ];
    const store = mockStore({});

    nock('https://beta.noteable.me')
      .intercept('/auth/local/jwt', 'POST')
      .reply(400, { });

    return store.dispatch(signInLocal('sportnak@gmail.com', 'password')).then(() => {
      expect(JSON.stringify(store.getActions())).equals(JSON.stringify(expectedActions));
    });
  });
});
