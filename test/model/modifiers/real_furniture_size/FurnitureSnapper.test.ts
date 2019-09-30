import { setupMap, setup } from "../../../test_utils/mocks";
import { ScaleModifier } from "../../../../src/model/modifiers/ScaleModifier";
import { Polygon, Point } from '@nightshifts.inc/geometry';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { FurnitureSnapper, SnapType } from '../../../../src/model/modifiers/real_furniture_size/FurnitureSnapper';

it ('Rotates furniture to face the snapping edges if snaptype is "ROTATE_TOWARD"', () => {
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

    const services = setup(map, []);

    const worldItems = services.importerService.import(map, [ ScaleModifier.modName ]);

    const originalSnapToEdge = new Segment(new Point(4, 4), new Point(4, 8));
    const realSnapToEdge = new Segment(new Point(5, 5), new Point(5, 7));

    const chair = worldItems.find(item => item.name === 'chair');
    const chairCenter = chair.dimensions.getBoundingCenter();
    const realChairDimensions = Polygon.createRectangle(chairCenter.x - 0.2, chairCenter.y + 0.3, 0.4, 0.6);

    const furnitureSnapper = new FurnitureSnapper(services, SnapType.ROTATE_TOWARD);

    const originalChairDimensions = <Polygon> chair.dimensions;
    chair.dimensions = realChairDimensions;
    furnitureSnapper.snap(chair, originalChairDimensions, [realSnapToEdge], [originalSnapToEdge]);

    expect(chair.rotation).toBeCloseTo(Math.PI / 2);
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.4, 5.8));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.4, 6.2));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(5, 6.2));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(5, 5.8));
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

    const services = setup(map, []);

    const worldItems = services.importerService.import(map, [ ScaleModifier.modName ]);

    const originalSnapToEdge = new Segment(new Point(4, 4), new Point(4, 8));
    const realSnapToEdge = new Segment(new Point(5, 5), new Point(5, 7));
    const chair = worldItems.find(item => item.name === 'chair');
    const chairCenter = chair.dimensions.getBoundingCenter();
    const realChairDimensions = Polygon.createRectangle(chairCenter.x - 0.2, chairCenter.y + 0.3, 0.4, 0.6);

    const furnitureSnapper = new FurnitureSnapper(services, SnapType.ROTATE_AWAY);

    const originalChairDimensions = <Polygon> chair.dimensions;
    chair.dimensions = realChairDimensions;
    furnitureSnapper.snap(chair, originalChairDimensions, [realSnapToEdge], [originalSnapToEdge]);

    expect(chair.rotation).toBeCloseTo(3 * Math.PI / 2);
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.4, 5.8));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.4, 6.2));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(5, 6.2));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(5, 5.8));
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

    const services = setup(map, []);

    const worldItems = services.importerService.import(map, [ ScaleModifier.modName ]);

    const originalSnapToEdge = new Segment(new Point(3, 8), new Point(6, 8));
    const realSnapToEdge = new Segment(new Point(3, 7), new Point(6, 7));
    const chair = worldItems.find(item => item.name === 'chair');
    const chairCenter = chair.dimensions.getBoundingCenter();
    const realChairDimensions = Polygon.createRectangle(chairCenter.x - 0.2, chairCenter.y + 0.3, 0.4, 0.6);

    const furnitureSnapper = new FurnitureSnapper(services, SnapType.ROTATE_TOWARD);

    const originalChairDimensions = <Polygon> chair.dimensions;
    chair.dimensions = realChairDimensions;
    furnitureSnapper.snap(chair, originalChairDimensions, [realSnapToEdge], [originalSnapToEdge]);

    expect(chair.rotation).toBeCloseTo(Math.PI / 2);
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.2, 7));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.2, 7.4));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.8, 7.4));
    expect(chair.dimensions).toHavePoint(services.geometryService.factory.point(4.8, 7));
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

    const services = setup(map, []);

    const worldItems = services.importerService.import(map, [ ScaleModifier.modName ]);

    const originalSnapToEdges = [
        new Segment(new Point(1, 2), new Point(3, 2)),
        new Segment(new Point(1, 1), new Point(1, 10))
    ];
    const realSnapToEdges = [
        new Segment(new Point(1, 2.5), new Point(3, 2.5)),
        new Segment(new Point(1.5, 1), new Point(1.5, 10))
    ];
    const table = worldItems.find(item => item.name === 'table');
    const tableCenter = table.dimensions.getBoundingCenter();
    const realChairDimensions = Polygon.createRectangle(tableCenter.x - 1, tableCenter.y + 1.5, 2, 3);

    const furnitureSnapper = new FurnitureSnapper(services, SnapType.ROTATE_TOWARD);

    const originalTableDimensions = <Polygon> table.dimensions;
    table.dimensions = realChairDimensions;
    furnitureSnapper.snap(table, originalTableDimensions, realSnapToEdges, originalSnapToEdges);

    expect(table.rotation).toBeCloseTo(Math.PI / 2);
    expect(table.dimensions).toHavePoint(services.geometryService.factory.point(1.5, 2.5));
    expect(table.dimensions).toHavePoint(services.geometryService.factory.point(1.5, 4.5));
    expect(table.dimensions).toHavePoint(services.geometryService.factory.point(4.5, 4.5));
    expect(table.dimensions).toHavePoint(services.geometryService.factory.point(4.5, 2.5));
});