module.exports = {
    "testRegex": "test/.*.test.tsx?$",
    // "transform": {
    //   // we need babel to transpile those files in node_modules which were published with some es6 features
    //   // which jest can not interpret (eg. export/import)
    //   "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    //   "^.+\\.tsx?$": "ts-jest",
    // },
    "transform": {
        // "^.+\\.js": "<rootDir>/node_modules/babel-jest",
        "^.+\\.tsx?$": "ts-jest"
      },
    transformIgnorePatterns: [
      // these are the modules which were published with es6 features
      "node_modules/(?!(@babylonjs/core)/)"
    ],
    "setupFilesAfterEnv": ['<rootDir>/test/setupTest.ts'],
    // preset: 'ts-jest',
    // transform: {
    //   '^.+\\.tsx?$': 'babel-jest',
    // },
  };
