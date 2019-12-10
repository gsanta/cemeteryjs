import { WorldItem } from "../../../../src/WorldItem";
import { Shape, Polygon } from "@nightshifts.inc/geometry";
import { CreateMockMeshModifier, MockMeshCreator } from '../../../../src/model/modifiers/CreateMockMeshModifier';


describe(`CreateMockMeshModifier`, () => {
    describe('apply', () => {
        it ('sets up mock Meshes for each `WorldItemInfo`', () => {
            const items: WorldItem[] = [
                <WorldItem> {
                    name: 'root',
                    dimensions: <Shape> Polygon.createRectangle(0, 0, 10, 15),
                    children: [
                        <WorldItem> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(0, 0, 5, 15),
                            children: [
                                <WorldItem> {
                                    name: 'chair',
                                    dimensions: <Shape> Polygon.createRectangle(2, 2, 1, 1),
                                    children: []
                                }
                            ]
                        },
                        <WorldItem> {
                            name: 'room',
                            dimensions: <Shape> Polygon.createRectangle(5, 0, 5, 15),
                            children: []
                        }
                    ]
                }
            ];

            const mockMeshCreator: MockMeshCreator<{dimensions: Shape}> = (worldItem: WorldItem) => {
                return [
                    {
                        dimensions: worldItem.dimensions
                    }
                ]
            }

            const mockMeshCreationTransformator = new CreateMockMeshModifier(mockMeshCreator);

            const worldItems = mockMeshCreationTransformator.apply(items);

            expect(worldItems[0].meshTemplate.type).toEqual('root');
            expect(worldItems[0].meshTemplate.meshes[0]).toPartiallyEqualToWorldItem({dimensions: Polygon.createRectangle(0, 0, 10, 15)});

            expect(worldItems[0].children[0].meshTemplate.type).toEqual('room');
            expect(worldItems[0].children[0].meshTemplate.meshes[0]).toPartiallyEqualToWorldItem({dimensions: Polygon.createRectangle(0, 0, 5, 15)});

            expect(worldItems[0].children[0].children[0].meshTemplate.type).toEqual('chair');
            expect(worldItems[0].children[0].children[0].meshTemplate.meshes[0]).toPartiallyEqualToWorldItem({dimensions: Polygon.createRectangle(2, 2, 1, 1)});

            expect(worldItems[0].children[1].meshTemplate.type).toEqual('room');
            expect(worldItems[0].children[1].meshTemplate.meshes[0]).toPartiallyEqualToWorldItem({dimensions: Polygon.createRectangle(5, 0, 5, 15)});
        });
    });
});
