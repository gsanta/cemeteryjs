
import * as chai from 'chai';
import { Shape } from '@nightshifts.inc/geometry';
import { expect } from 'chai';
import { hasAnyWorldItemInfoDimension } from './parsers/room_separator_parser/RoomSeparatorParser.test';
import { WorldItemInfo } from '../src';

declare global {
    export namespace Chai {
        interface Assertion {
            haveBorders(borderDimensions: Shape[]):Assertion;
            haveAnyWithDimensions(dimensions: Shape): Assertion;
        }
    }
}

chai.use(function (_chai, utils) {
    _chai.Assertion.addMethod('haveBorders', function (borderDimensions: Shape[]) {
        const room: WorldItemInfo = this._obj;

        borderDimensions.forEach(dimension => expect(hasAnyWorldItemInfoDimension(dimension, room.borderItems)).to.be.true);
    });

    _chai.Assertion.addMethod('haveAnyWithDimensions', function (dimensions: Shape) {
        const worldItems: WorldItemInfo[] = this._obj;


        expect(hasAnyWorldItemInfoDimension(dimensions, worldItems)).to.be.true;
    });
});

