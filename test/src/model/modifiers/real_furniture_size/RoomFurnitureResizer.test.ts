import { AssignBordersToRoomsModifier } from '../../../../../src/model/modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from "../../../../../src/model/modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../../../../../src/model/modifiers/ChangeBorderWidthModifier";
import { RoomFurnitureResizer } from "../../../../../src/model/modifiers/real_furniture_size/RoomFurnitureResizer";
import { ScaleModifier } from "../../../../../src/model/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../../../../src/model/modifiers/SegmentBordersModifier";
import { setup, setupTestEnv } from "../../../../testUtils";
import { FileFormat } from '../../../../../src/WorldGenerator';
import { FakeModelImporterService } from '../../../../fakes/FakeModelImporterService';
import { Point } from '@nightshifts.inc/geometry';

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

    const fakeModelImporter = new FakeModelImporterService(
        new Map([
            ['assets/models/table.babylon', new Point(2, 1)],
            ['assets/models/chair.babylon', new Point(1, 1)]
        ])
    );
    const services = setupTestEnv(map, FileFormat.TEXT, fakeModelImporter);

    const [root] = services.modifierService.applyModifiers(services.configService.worldItemHierarchy, [
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

    expect(table1).toHaveDimensions(services.geometryService.factory.rectangle(2, 4, 2, 4));
    expect(chair1).toHaveDimensions(services.geometryService.factory.rectangle(5, 8, 2, 2));
    expect(table2).toHaveDimensions(services.geometryService.factory.rectangle(11, 4, 3, 4));

    roomFurnitureResizer.resize(rooms[0]);
    roomFurnitureResizer.resize(rooms[1]);

    expect(table1).toHaveDimensions(services.geometryService.factory.rectangle(2, 5.5, 2, 1));
    expect(chair1).toHaveDimensions(services.geometryService.factory.rectangle(5.5, 8.5, 1, 1));
    expect(table2).toHaveDimensions(services.geometryService.factory.rectangle(11.5, 5.5, 2, 1));
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

    const fakeModelImporter = new FakeModelImporterService(
        new Map([
            ['assets/models/table.babylon', new Point(2, 1)],
            ['assets/models/chair.babylon', new Point(1, 1)]
        ])
    );
    const services = setupTestEnv(map, FileFormat.TEXT, fakeModelImporter);

    const [root] = services.modifierService.applyModifiers(services.configService.worldItemHierarchy, [
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

    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(1, 4, 2, 4));
    expect(chair).toHaveDimensions(services.geometryService.factory.rectangle(7, 8, 2, 2));

    roomFurnitureResizer.resize(room);

    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(0.5, 5, 1, 2));
    expect(chair).toHaveDimensions(services.geometryService.factory.rectangle(8.5, 8.5, 1, 1));
});