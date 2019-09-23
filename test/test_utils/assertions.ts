import { WorldItem } from '../../src/WorldItem';
import { Shape } from '@nightshifts.inc/geometry';
import { hasAnyWorldItemInfoDimension } from '../model/parsers/BorderParser.test';

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveBorders(borderDimensions: Shape[]),
            toHaveAnyWithDimensions(dimensions: Shape),
            toPartiallyEqualToWorldItem(partialWorldItem: Partial<WorldItem>),
            toContainWorldItem(partialWorldItem: Partial<WorldItem>)
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
    },

    toContainWorldItem(worldItems: WorldItem[], partialWorldItem: Partial<WorldItem>) {
        for (let i = 0; i < worldItems.length; i++) {
            try {
                expect(worldItems[i]).toPartiallyEqualToWorldItem(partialWorldItem);
                return {
                    pass: true,
                    message: () => ''
                }
            } catch (e) {
                // error expected
            }
        }

        return {
            pass: false,
            message: () => `${worldItems.toString()} does not match any element in the list.`
        }
    },

    toPartiallyEqualToWorldItem(worldItem: WorldItem, partialWorldItem: Partial<WorldItem>) {
        let pass = true;
        let message = () => '';

        if (partialWorldItem.name !== undefined && partialWorldItem.name !== worldItem.name) {
            pass = false;
            message = () => `Names are not equal: ${partialWorldItem.name}, ${worldItem.name}`;
        } else if (partialWorldItem.id !== undefined && partialWorldItem.id !== worldItem.id) {
            pass = false;
            message = () => `Ids are not equal: ${partialWorldItem.id}, ${worldItem.id}`;
        } else if (partialWorldItem.type !== undefined && partialWorldItem.type !== worldItem.type) {
            pass = false;
            message = () => `Types are not equal: ${partialWorldItem.type}, ${worldItem.type}`;
        } else if (partialWorldItem.dimensions !== undefined && !partialWorldItem.dimensions.equalTo(worldItem.dimensions)) {
            pass = false;
            message = () => `Dimensions are not equal: ${partialWorldItem.dimensions}, ${worldItem.dimensions}`;
        } else if (partialWorldItem.rotation !== undefined && partialWorldItem.rotation !== worldItem.rotation) {
            pass = false;
            message = () => `Rotations are not equal: ${partialWorldItem.rotation}, ${worldItem.rotation}`;
        }

        if (pass) {
            return {
                message: () => 'should not happen',
                pass: true,
            };
        } else {
            return {
                message: message,
                pass: false,
            };
        }
    }
});

