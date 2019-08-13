import { WorldItemInfo } from "../../src/WorldItemInfo";
import { Shape, Polygon } from "@nightshifts.inc/geometry";
import { MockMeshCreationTransformator, MockMeshCreator } from '../../src/transformators/MockMeshCreationTransformator';


describe(`MockMeshCreationTransformator`, () => {
    describe('transform', () => {
        it ('sets up mock Meshes for each `WorldItemInfo`', () => {
            const items: WorldItemInfo[] = [
                <WorldItemInfo> {
                    name: 'root',
                    dimensions: <Shape> Polygon.createRectangle(0, 0, 10, 15),
                    children: [
                        <WorldItemInfo> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(0, 0, 5, 15),
                            children: [
                                <WorldItemInfo> {
                                    name: 'chair',
                                    dimensions: <Shape> Polygon.createRectangle(2, 2, 1, 1),
                                    children: []
                                }
                            ]
                        },
                        <WorldItemInfo> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(5, 0, 5, 15),
                            children: []
                        }
                    ]
                }
            ];

            const mockMeshCreator: MockMeshCreator<{dimensions: Shape}> = (worldItem: WorldItemInfo) => {
                return [
                    {
                        dimensions: worldItem.dimensions
                    }
                ]
            }

            const mockMeshCreationTransformator = new MockMeshCreationTransformator(mockMeshCreator);

            const worldItems = mockMeshCreationTransformator.transform(items);

            expect(worldItems[0].meshTemplate.type).toEqual('root');
            expect(worldItems[0].meshTemplate.meshes[0]).toMatchObject({dimensions: Polygon.createRectangle(0, 0, 10, 15)});

            expect(worldItems[0].children[0].meshTemplate.type).toEqual('room');
            expect(worldItems[0].children[0].meshTemplate.meshes[0]).toMatchObject({dimensions: Polygon.createRectangle(0, 0, 5, 15)});

            expect(worldItems[0].children[0].children[0].meshTemplate.type).toEqual('chair');
            expect(worldItems[0].children[0].children[0].meshTemplate.meshes[0]).toMatchObject({dimensions: Polygon.createRectangle(2, 2, 1, 1)});

            expect(worldItems[0].children[1].meshTemplate.type).toEqual('room');
            expect(worldItems[0].children[1].meshTemplate.meshes[0]).toMatchObject({dimensions: Polygon.createRectangle(5, 0, 5, 15)});
        });
    });
});
