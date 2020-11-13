require('jsdom-global')()
global.DOMParser = window.DOMParser
let common = [
    'test/cucumber/features/**/*.feature',
    '--require ./test/cucumber/steps/**/*.steps.ts',
    '--require-module ts-node/register',
    // '--format progress',
    '--format node_modules/cucumber-pretty',
    // '--tags "not @ignore"',
    '--publish-quiet'
].join(' ');
module.exports = {
    default: common
};