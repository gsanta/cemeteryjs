import { MockWorldGenerator } from '../../../src/integrations/mock/MockWorldGenerator';
import { WorldItem } from '../../../src/WorldItem';
import { FileFormat } from '../../../src/WorldGenerator';


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

            - = room
            W = wall BORDER
            I = window BORDER
            D = door BORDER

            \`
        `;

        const mockWorldGenerator = new MockWorldGenerator();

        const worldItems: WorldItem[] = [];

        mockWorldGenerator.generate(worldMap, FileFormat.TEXT, {
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
