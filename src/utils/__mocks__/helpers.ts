module.exports = {
  __esModule: true,
  getAngularInfo: jest.fn(async () => ({ versions: [], 'dist-tags': { latest: '14.0.0', 'v13-lts': '13.0.0' } })),
  isYarnAvailable: jest.fn(async () => false),
  initArguments: jest.fn(async () => null),
  isDirectoryExistsAndNotEmpty: jest.fn(title => title === 'same'),
  getCWD: jest.fn()
};
