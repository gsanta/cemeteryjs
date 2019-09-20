import { MockWorldGenerator } from '../../../src/integrations/mock/MockWorldGenerator';
import { WorldConfig } from '../../../src/model/services/ImporterService';
import { WorldItem } from '../../../src/WorldItem';
import { meshDescriptors } from '../../setup/meshDescriptors';


describe('MockWorldGenerator', () => {
    it ('generates the world without requiring webgl implementation', () => {
        const worldMap = `
            map \`

            WWWDDWWWWWDDWWW
            W-------------W
            W-------------W
            W-------------W
            WWWWWWWWWWWWWWW

            \`

            definitions \`

            - = empty
            W = wall
            I = window
            D = door

            \`
        `;

        const worldConfig: WorldConfig = {
            meshDescriptors: meshDescriptors,
            borders: ['door', 'window', 'wall'],
            furnitures: [],
            xScale: 1,
            yScale: 2
        }
        const mockWorldGenerator = new MockWorldGenerator();

        const worldItems: WorldItem[] = [];

        mockWorldGenerator.generate(worldMap, worldConfig, {
            convert(worldItem: WorldItem): any {
                worldItems.push(worldItem);
            },
            addChildren(parent: any, children: any[]): void {},
            addBorders(item: any, borders: any[]): void {},
            done() {}
        });

        expect(worldItems.length).toEqual(27);
    });
});
