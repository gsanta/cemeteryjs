import { Then, When } from "cucumber";
import expect from 'expect';

Then('dump json', function() {
    let json = this.registry.services.export.export();

    json = JSON.stringify(JSON.parse(json), null, 4);
    console.log(json);
});

Then('json is:', function(expectedJson: string) {
    let json = this.registry.services.export.export();

    json = JSON.stringify(JSON.parse(json), null, 4);

    expect(json).toEqual(expectedJson);
});

When('import json:', function(json: string) {
    this.registry.services.import.import(json);
});