module.exports = {
    testRegex: "test/.*.test.tsx?$",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    transformIgnorePatterns: [
        "node_modules/(?!(@babylonjs/core)/)"
    ],
    setupFilesAfterEnv: ['<rootDir>/test/model/assertions.ts'],
    "coverageReporters": [
        "json",
        "text",
        "lcov"
    ],
    "collectCoverageFrom": ["src/**/*.ts"]
};
