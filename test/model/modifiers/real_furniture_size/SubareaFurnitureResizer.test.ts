import { setupMap, setup } from "../../testUtils";
import { ScaleModifier } from "../../../../src/model/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../../../src/model/modifiers/SegmentBordersModifier";
import { BuildHierarchyModifier } from "../../../../src/model/modifiers/BuildHierarchyModifier";
import { SubareaFurnitureResizer } from "../../../../src/model/modifiers/real_furniture_size/SubareaFurnitureResizer";
import { FileFormat } from "../../../../src/WorldGenerator";

it ('Snap furnitures in a subarea to the biggest furniture in that subarea', () => {
    const map = `
    map \`

    WWWWWWWWWW
    W--==----W
    W--TTT---W
    W--TTTH--W
    W--HHH---W
    W--------W
    WWWWWWWWWW

    \`

    definitions \`

    W = wall ROLES [BORDER]
    D = door ROLES [BORDER]
    I = window ROLES [BORDER]
    - = room ROLES [CONTAINER]
    T = table DIM 2 1 MOD assets/models/table.babylon
    H = chair DIM 1 1  MOD assets/models/chair.babylon
    = = _subarea ROLES [CONTAINER]

    \`
    `;

    const services = setup(map, FileFormat.TEXT);

    const [root] = services.importerService.import(map, [
        ScaleModifier.modName,
        SegmentBordersModifier.modName,
        BuildHierarchyModifier.modName
    ]);
    const room = root.children.filter(item => item.name === 'room')[0];
    const subarea = room.children.filter(item => item.name === '_subarea')[0];

    const table = subarea.children.filter(item => item.name === 'table')[0];
    const chair1 = subarea.children.find(item => item.id === 'chair-1');
    const chair2 = subarea.children.find(item => item.id === 'chair-2');

    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(3, 4, 3, 4));
    expect(chair1).toHaveDimensions(services.geometryService.factory.rectangle(6, 6, 1, 2));
    expect(chair2).toHaveDimensions(services.geometryService.factory.rectangle(3, 8, 3, 2));

    const subareaFurnitureResizer = new SubareaFurnitureResizer(services);
    subareaFurnitureResizer.resize(subarea);

    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(3.5, 5.5, 2, 1));
    expect(chair1).toHaveDimensions(services.geometryService.factory.rectangle(5.5, 6.5, 1, 1));
    expect(chair2).toHaveDimensions(services.geometryService.factory.rectangle(4, 6.5, 1, 1));
});