/* eslint-disable no-undef */
jest.mock('react-native-fabric', () => ({}));
jest.mock('react-native-fetch-blob', () => ({
  fs: {
    dirs: { DocumentDir: '' },
    unlink: () => {},
  },
}));
jest.mock('react-native-audio', () => ({
  AudioUtils: {
    DocumentDirectoryPath: '',
  },
}));
jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => new Promise((resolve) => {
      resolve(null);
    })),
    multiSet: jest.fn(() => new Promise((resolve) => {
      resolve(null);
    })),
    getItem: key => new Promise((resolve) => {
      switch (key) {
        case '@ACCOUNTS:CURRENT_USER':
          resolve('{ "jwt": 1 }');
          break;
        default:
          resolve({});
      }
    }),
    multiGet: jest.fn(() => new Promise((resolve) => {
      resolve([]);
    })),
    removeItem: jest.fn(() => new Promise((resolve) => {
      resolve(null);
    })),
    getAllKeys: jest.fn(() => new Promise((resolve) => {
      resolve(['one', 'two', 'three']);
    })),
  },
}));
