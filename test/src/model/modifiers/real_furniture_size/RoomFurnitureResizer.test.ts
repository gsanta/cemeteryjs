import { AssignBordersToRoomsModifier } from '../../../../../src/world_generator/modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from "../../../../../src/world_generator/modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../../../../../src/world_generator/modifiers/ChangeBorderWidthModifier";
import { RoomFurnitureResizer } from "../../../../../src/world_generator/modifiers/real_furniture_size/RoomFurnitureResizer";
import { ScaleModifier } from "../../../../../src/world_generator/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../../../../src/world_generator/modifiers/SegmentBordersModifier";
import { setup, setupTestEnv } from "../../../../testUtils";
import { FileFormat } from '../../../../../src/WorldGenerator';
import { FakeModelLoader } from '../../../../fakes/FakeModelLoader';
import { Point } from '../../../../../src/model/geometry/shapes/Point';
import { Polygon } from '../../../../../src/model/geometry/shapes/Polygon';

it ('Resize each funrinture in the room', () => {

    const map = `
    map \`

    WWWWWWWWWWWWWWWWWWW
    W--------W--------W
    W-TT-----W-TTT----W
    W-TT-----W-TTT----W
    W----HH--W--------W
    W--------W--------W
    WWWWWWWWWWWWWWWWWWW

    \`

    definitions \`

    W = wall ROLES [BORDER]
    - = room ROLES [CONTAINER]
    T = table DIM 2 1 MOD assets/models/table.babylon
    H = chair DIM 1 MOD assets/models/chair.babylon

    \`
    `;

    const fakeModelImporter = new FakeModelLoader(
        new Map([
            ['assets/models/table.babylon', new Point(2, 1)],
            ['assets/models/chair.babylon', new Point(1, 1)]
        ])
    );
    const services = setupTestEnv(map, FileFormat.TEXT, fakeModelImporter);

    const [root] = services.modifierExecutor.applyModifiers(services.gameAssetStore.gameObjects, [
        SegmentBordersModifier.modName,
        BuildHierarchyModifier.modName,
        AssignBordersToRoomsModifier.modName,
        ScaleModifier.modName,
        ChangeBorderWidthModifier.modName
    ]);

    const rooms = root.children.filter(item => item.name === 'room');
    const table1 = rooms[0].children[0];
    const chair1 = rooms[0].children[1];
    const table2 = rooms[1].children[0];

    const roomFurnitureResizer = new RoomFurnitureResizer(services);

    expect(table1).toHaveDimensions(Polygon.createRectangle(2, 4, 2, 4));
    expect(chair1).toHaveDimensions(Polygon.createRectangle(5, 8, 2, 2));
    expect(table2).toHaveDimensions(Polygon.createRectangle(11, 4, 3, 4));

    roomFurnitureResizer.resize(rooms[0]);
    roomFurnitureResizer.resize(rooms[1]);

    expect(table1).toHaveDimensions(Polygon.createRectangle(2, 5.5, 2, 1));
    expect(chair1).toHaveDimensions(Polygon.createRectangle(5.5, 8.5, 1, 1));
    expect(table2).toHaveDimensions(Polygon.createRectangle(11.5, 5.5, 2, 1));
});


it ('Snap furnitures which are beside walls', () => {
    const map = `
    map \`

        WWWWWWWWWW
        W--------W
        WTT------W
        WTT------W
        W------HHW
        W--------W
        WWWWWWWWWW

        \`

        definitions \`

        W = wall ROLES [BORDER]
        - = room ROLES [CONTAINER]
        T = table DIM 2 1 MOD assets/models/table.babylon
        H = chair DIM 1 MOD assets/models/chair.babylon

        \`
    `;

    const fakeModelImporter = new FakeModelLoader(
        new Map([
            ['assets/models/table.babylon', new Point(2, 1)],
            ['assets/models/chair.babylon', new Point(1, 1)]
        ])
    );
    const services = setupTestEnv(map, FileFormat.TEXT, fakeModelImporter);

    const [root] = services.modifierExecutor.applyModifiers(services.gameAssetStore.gameObjects, [
        SegmentBordersModifier.modName,
        BuildHierarchyModifier.modName,
        AssignBordersToRoomsModifier.modName,
        ScaleModifier.modName,
        ChangeBorderWidthModifier.modName
    ]);
    
    const room = root.children.filter(item => item.name === 'room')[0];
    const table = room.children[0];
    const chair = room.children[1];

    const roomFurnitureResizer = new RoomFurnitureResizer(services);

    expect(table).toHaveDimensions(Polygon.createRectangle(1, 4, 2, 4));
    expect(chair).toHaveDimensions(Polygon.createRectangle(7, 8, 2, 2));

    roomFurnitureResizer.resize(room);

    expect(table).toHaveDimensions(Polygon.createRectangle(0.5, 5, 1, 2));
    expect(chair).toHaveDimensions(Polygon.createRectangle(8.5, 8.5, 1, 1));
});