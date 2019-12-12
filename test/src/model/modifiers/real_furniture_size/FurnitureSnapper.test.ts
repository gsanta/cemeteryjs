import { setupMap, setup } from "../../../../testUtils";
import { ScaleModifier } from "../../../../../src/model/modifiers/ScaleModifier";
import { Polygon, Point } from '@nightshifts.inc/geometry';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { FurnitureSnapper, SnapType } from '../../../../../src/model/modifiers/real_furniture_size/FurnitureSnapper';
import { GameObject } from '../../../../../src/model/types/GameObject';
import { WorldGeneratorServices } from "../../../../../src/model/services/WorldGeneratorServices";
import { FileFormat } from "../../../../../src/WorldGenerator";

it ('Rotates furniture to face the snapping edges if snaptype is "ROTATE_PARALLEL_FACE_TOWARD"', () => {
    const map = setupMap(
        `
        WWWWWWWWWW
        W--===---W
        W--HTTT--W
        W--HTTT--W
        W--------W
        W--------W
        WWWWWWWWWW
        `
    );

    const services = setup(map, FileFormat.TEXT);

    let worldItems = services.gameObjectBuilder.build(map);
    worldItems = services.modifierExecutor.applyModifiers(worldItems, [ ScaleModifier.modName ]);

    const originalSnappingEdge = new Segment(new Point(4, 4), new Point(4, 8));
    const realSnappingEdge = new Segment(new Point(5, 5), new Point(5, 7));

    const chair = worldItems.find(item => item.name === 'chair');
    const realChairDimensions = createRealFurnitureDimensions(services, chair, 0.4, 0.6);
    expect(realChairDimensions.getBoundingCenter()).toEqual(new Point(3.5, 6));

    const furnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PARALLEL_FACE_TOWARD);

    const originalChairDimensions = <Polygon> chair.dimensions;
    chair.dimensions = realChairDimensions;
    furnitureSnapper.snap(chair, originalChairDimensions, [realSnappingEdge], [originalSnappingEdge]);

    expect(chair.rotation).toBeCloseTo(Math.PI / 2);
    expect(chair).toHaveDimensions(Polygon.createRectangle(4.4, 5.8, 0.6, 0.4));
});

it ('Rotate the furniture to face away from the snapping edges if snaptype is "ROTATE_AWAY"', () => {
    const map = setupMap(
        `
        WWWWWWWWWW
        W--===---W
        W--HTTT--W
        W--HTTT--W
        W--------W
        W--------W
        WWWWWWWWWW
        `
    );

    const services = setup(map, FileFormat.TEXT);

    let worldItems = services.gameObjectBuilder.build(map);
    worldItems = services.modifierExecutor.applyModifiers(worldItems, [ ScaleModifier.modName ]);

    const originalSnappingEdge = new Segment(new Point(4, 4), new Point(4, 8));
    const realSnappingEdge = new Segment(new Point(5, 5), new Point(5, 7));

    const chair = worldItems.find(item => item.name === 'chair');
    const realChairDimensions = createRealFurnitureDimensions(services, chair, 0.4, 0.6);
    expect(realChairDimensions.getBoundingCenter()).toEqual(new Point(3.5, 6));


    const furnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PARALLEL_FACE_AWAY);

    const originalChairDimensions = <Polygon> chair.dimensions;
    chair.dimensions = realChairDimensions;
    furnitureSnapper.snap(chair, originalChairDimensions, [realSnappingEdge], [originalSnappingEdge]);

    expect(chair.rotation).toBeCloseTo(3 * Math.PI / 2);
    expect(chair).toHaveDimensions(Polygon.createRectangle(4.4, 5.8, 0.6, 0.4));
});

it ('Rotate furniture which are perpendicular to the snapping edges', () => {
    const map = setupMap(
        `
        WWWWWWWWWW
        W--===---W
        W--TTT---W
        W--TTT---W
        W---H----W
        W--------W
        WWWWWWWWWW
        `
    );

    const services = setup(map, FileFormat.TEXT);

    let worldItems = services.gameObjectBuilder.build(map);
    worldItems = services.modifierExecutor.applyModifiers(worldItems, [ ScaleModifier.modName ]);

    const originalSnappingEdge = new Segment(new Point(3, 8), new Point(6, 8));
    const realSnappingEdge = new Segment(new Point(3, 7), new Point(6, 7));
    const chair = worldItems.find(item => item.name === 'chair');
    const realChairDimensions = createRealFurnitureDimensions(services, chair, 0.4, 0.6);
    expect(realChairDimensions.getBoundingCenter()).toEqual(new Point(4.5, 9));

    const furnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PERPENDICULAR);

    const originalChairDimensions = <Polygon> chair.dimensions;
    chair.dimensions = realChairDimensions;
    furnitureSnapper.snap(chair, originalChairDimensions, [realSnappingEdge], [originalSnappingEdge]);

    expect(chair.rotation).toBeCloseTo(Math.PI / 2);
    expect(chair).toHaveDimensions(Polygon.createRectangle(4.2, 7, 0.6, 0.4));
});

it ('Rotate furniture into a corner', () => {
    const map = setupMap(
        `
        WWWWWWWWWW
        WTT------W
        WTT------W
        WTT------W
        W--------W
        W--------W
        WWWWWWWWWW
        `
    );

    const services = setup(map, FileFormat.TEXT);

    let worldItems = services.gameObjectBuilder.build(map);
    worldItems = services.modifierExecutor.applyModifiers(worldItems, [ ScaleModifier.modName ]);

    const originalSnappingEdges = [
        new Segment(new Point(1, 1), new Point(1, 10)),
        new Segment(new Point(1, 2), new Point(3, 2))
    ];
    const realSnappingEdges = [
        new Segment(new Point(1.5, 1), new Point(1.5, 10)),
        new Segment(new Point(1, 2.5), new Point(3, 2.5))
    ];
    const table = worldItems.find(item => item.name === 'table');
    const realTableDimensions = createRealFurnitureDimensions(services, table, 2, 3);
    expect(realTableDimensions.getBoundingCenter()).toEqual(new Point(2, 5));

    const furnitureSnapper = new FurnitureSnapper(SnapType.ROTATE_PARALLEL_FACE_TOWARD);

    const originalTableDimensions = <Polygon> table.dimensions;
    table.dimensions = realTableDimensions;
    furnitureSnapper.snap(table, originalTableDimensions, realSnappingEdges, originalSnappingEdges);

    expect(table.rotation).toBeCloseTo(3 * Math.PI / 2);
    expect(table).toHaveDimensions(Polygon.createRectangle(1.5, 2.5, 3, 2));
});

function createRealFurnitureDimensions(services: WorldGeneratorServices, furniture: GameObject, width: number, height: number): Polygon {
    const furnitureCenter = furniture.dimensions.getBoundingCenter();

    return Polygon.createRectangle(furnitureCenter.x - width / 2, furnitureCenter.y - height / 2, width, height);
}