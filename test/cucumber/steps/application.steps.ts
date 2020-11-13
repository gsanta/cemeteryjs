
import { After, Before, Given, Then } from 'cucumber';
import expect from 'expect';
import { EditorExt } from '../world/EditorExt';

Before(function() {
    const editor = new EditorExt();
    this.registry = editor.registry;
    editor.setup();
});

After(function() {
    this.registry = undefined;
});

Given('empty editor', () => {

});

Then('test is successful', () => {
    expect(1).toBe(1)
});