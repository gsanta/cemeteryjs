module.exports = {
    testRegex: "test/.*.test.tsx?$",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    transformIgnorePatterns: [
        "node_modules/(?!(@babylonjs/core)/)"
    ],
    setupFilesAfterEnv: ['<rootDir>/test/test_utils/assertions.ts'],
    moduleNameMapper: {
        "\\.(gwm)$": "<rootDir>/test/test_utils/fileMock.js"
    }
};
