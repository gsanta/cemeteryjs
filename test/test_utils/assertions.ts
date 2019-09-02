import { WorldItem } from '../../src/WorldItem';
import { Shape } from '@nightshifts.inc/geometry';
import { hasAnyWorldItemInfoDimension } from '../parsers/BorderParser.test';

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveBorders(borderDimensions: Shape[]),
            toHaveAnyWithDimensions(dimensions: Shape)
        }
    }
}

expect.extend({
    toHaveBorders(room: WorldItem, borderDimensions: Shape[]) {
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

    toHaveAnyWithDimensions(worldItems: WorldItem[], dimensions: Shape) {

        let pass = true;

        let message: string = '';


        try {
            hasAnyWorldItemInfoDimension(dimensions, worldItems)
        } catch (e) {
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

