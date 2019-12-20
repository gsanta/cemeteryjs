import { PolygonShapeBuilder } from "../../../../../src/world_generator/importers/builders/PolygonShapeBuilder";
import { TextWorldMapReader } from '../../../../../src/world_generator/importers/text/TextWorldMapReader';
import { setup } from "../../../../testUtils";
import { FileFormat } from '../../../../../src/WorldGenerator';
import { Polygon } from "../../../../../src/model/geometry/shapes/Polygon";
import { Point } from "../../../../../src/model/geometry/shapes/Point";

it ('Create items for a given type which is represented on the world map by a polygon shape.', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W---W----W
        W---W----W
        W---W----W
        W---W----W
        WWWWWWWWWW

        \`

        definitions \`
            - = empty
            W = wall
        \`
    `;

    const services = setup(map, FileFormat.TEXT);
    const polygonAreaInfoParser = new PolygonShapeBuilder('empty', services, new TextWorldMapReader(services));

    const worldItems = polygonAreaInfoParser.build(map);

    expect(worldItems.length).toEqual(2);
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(1, 1, 3, 4));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(5, 1, 4, 4));
});

it ('Create a more complicated polygon shape TEST 1', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W---WWWWWW
        W----WWWWW
        W----WWWWW
        W------WWW
        WWWWWWWWWW
        \`

        definitions \`
            - = empty
            W = wall
        \`
    `;

    const services = setup(map, FileFormat.TEXT);
    const polygonAreaInfoParser = new PolygonShapeBuilder('empty', services, new TextWorldMapReader(services));

    const worldItem = polygonAreaInfoParser.build(map);

    expect(worldItem.length).toEqual(1);
    expect(worldItem[0].dimensions.equalTo(new Polygon([
        new Point(1, 1),
        new Point(1, 5),
        new Point(7, 5),
        new Point(7, 4),
        new Point(5, 4),
        new Point(5, 2),
        new Point(4, 2),
        new Point(4, 1)
    ]))).toBeTruthy();
});

it ('Create a more complicated polygon shape TEST 2', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W----WWWWW
        W----WWWWW
        WWW--WWWWW
        WWW--WWWWW
        WWWWWWWWWW

        \`

        definitions \`
            - = empty
            W = wall
        \`
    `;

    const services = setup(map, FileFormat.TEXT);
    const polygonAreaInfoParser = new PolygonShapeBuilder('empty', services, new TextWorldMapReader(services));

    const worldItem = polygonAreaInfoParser.build(map);

    expect(worldItem.length).toEqual(1);
    expect(worldItem[0].dimensions.equalTo(new Polygon([
        new Point(1, 1),
        new Point(1, 3),
        new Point(3, 3),
        new Point(3, 5),
        new Point(5, 5),
        new Point(5, 1),
    ]))).toBeTruthy();
});