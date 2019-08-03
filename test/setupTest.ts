import { WorldItemInfo } from '../src/WorldItemInfo';
import { Shape } from '@nightshifts.inc/geometry';
import { hasAnyWorldItemInfoDimension } from './parsers/room_separator_parser/RoomSeparatorParser.test';
// declare const expect;

expect.extend({
    toHaveBorders(room: WorldItemInfo, borderDimensions: Shape[]) {
        let pass = true;

        let message: string = '';

        try {
            for (let i = 0; i < borderDimensions.length; i++) {
                hasAnyWorldItemInfoDimension(borderDimensions[i], room.borderItems)
            }
        } catch (e) {
            pass = false;
            message = e.message;
        }

        if (pass) {
            return {
                message: () => 'should not happen',
                pass: true,
            };
        } else {
            return {
                message: () => message,
                pass: false,
            };
        }
    },

    toHaveAnyWithDimensions(worldItems: WorldItemInfo[], dimensions: Shape) {

        let pass = true;

        let message: string = '';


        try {
            hasAnyWorldItemInfoDimension(dimensions, worldItems)
        } catch(e) {
            message = e.message;
        }

        if (pass) {
            return {
                message: () => 'should not happen',
                pass: true,
            };
        } else {
            return {
                message: () => message,
                pass: false,
            };
        }

    }
});

