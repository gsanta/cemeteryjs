import { setup } from '../testUtils';
import { FileFormat } from '../../../src/WorldGenerator';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { Point, Polygon } from '@nightshifts.inc/geometry';


it ('Import walls correctly from svg format', () => {
    const worldMap = `
<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000" class="sc-bxivhb eycvSb">
    <metadata>
        <wg-type type-name="wall" color="brown" is-border="true"/>
        <wg-type type-name="room" color="red" is-border="false"/>
    </metadata>

    <rect width="10px" height="10px" x="370px" y="110px" fill="#7B7982" data-wg-x="370" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="110px" fill="#7B7982" data-wg-x="380" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="110px" fill="#7B7982" data-wg-x="390" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="110px" fill="#7B7982" data-wg-x="400" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="110px" fill="#7B7982" data-wg-x="410" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="370px" y="120px" fill="#7B7982" data-wg-x="370" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="370px" y="130px" fill="#7B7982" data-wg-x="370" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="370px" y="140px" fill="#7B7982" data-wg-x="370" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="370px" y="150px" fill="#7B7982" data-wg-x="370" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="150px" fill="#7B7982" data-wg-x="380" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="150px" fill="#7B7982" data-wg-x="390" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="150px" fill="#7B7982" data-wg-x="400" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="150px" fill="#7B7982" data-wg-x="410" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="120px" fill="#7B7982" data-wg-x="410" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="130px" fill="#7B7982" data-wg-x="410" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="140px" fill="#7B7982" data-wg-x="410" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="120px" data-wg-x="380" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="380px" y="130px" data-wg-x="380" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="380px" y="140px" data-wg-x="380" data-wg-y="140" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="390px" y="120px" data-wg-x="390" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="390px" y="130px" data-wg-x="390" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="390px" y="140px" data-wg-x="390" data-wg-y="140" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="120px" data-wg-x="400" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="130px" data-wg-x="400" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="140px" data-wg-x="400" data-wg-y="140" data-wg-type="room"></rect>
</svg>
`;

    const services = setup(worldMap, FileFormat.SVG);

    const worldItems = services.importerService.import(worldMap, []);
    const walls = worldItems.filter(worldItem => worldItem.name === 'wall');

    expect(walls).toContainWorldItem({ dimensions: new Segment(new Point(0.5, 4.5), new Point(4.5, 4.5)), isBorder: true, rotation: 0 });
    expect(walls).toContainWorldItem({ dimensions: new Segment(new Point(0.5, 0.5), new Point(4.5, 0.5)), isBorder: true, rotation: 0 });
    expect(walls).toContainWorldItem({ dimensions: new Segment(new Point(4.5, 0.5), new Point(4.5, 4.5)), isBorder: true, rotation: Math.PI / 2 });
    expect(walls).toContainWorldItem({ dimensions: new Segment(new Point(0.5, 0.5), new Point(0.5, 4.5)), isBorder: true, rotation: Math.PI / 2 });
});

it ('Import rooms correctly from svg format', () => {
    const worldMap = `
<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000" class="sc-bxivhb eycvSb">
    <metadata>
        <wg-type type-name="wall" color="brown" is-border="true"/>
        <wg-type type-name="room" color="red" is-border="false"/>
    </metadata>
    <rect width="10px" height="10px" x="380px" y="80px" fill="#7B7982" data-wg-x="380" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="80px" fill="#7B7982" data-wg-x="390" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="80px" fill="#7B7982" data-wg-x="400" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="80px" fill="#7B7982" data-wg-x="410" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="80px" fill="#7B7982" data-wg-x="420" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="430px" y="80px" fill="#7B7982" data-wg-x="430" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="440px" y="80px" fill="#7B7982" data-wg-x="440" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="450px" y="80px" fill="#7B7982" data-wg-x="450" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="80px" fill="#7B7982" data-wg-x="460" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="90px" fill="#7B7982" data-wg-x="380" data-wg-y="90" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="100px" fill="#7B7982" data-wg-x="380" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="110px" fill="#7B7982" data-wg-x="380" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="120px" fill="#7B7982" data-wg-x="380" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="130px" fill="#7B7982" data-wg-x="380" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="380px" y="140px" fill="#7B7982" data-wg-x="380" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="140px" fill="#7B7982" data-wg-x="390" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="140px" fill="#7B7982" data-wg-x="400" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="140px" fill="#7B7982" data-wg-x="410" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="140px" fill="#7B7982" data-wg-x="460" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="90px" fill="#7B7982" data-wg-x="460" data-wg-y="90" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="100px" fill="#7B7982" data-wg-x="460" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="110px" fill="#7B7982" data-wg-x="460" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="120px" fill="#7B7982" data-wg-x="460" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="130px" fill="#7B7982" data-wg-x="460" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="430px" y="110px" fill="#7B7982" data-wg-x="430" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="440px" y="110px" fill="#7B7982" data-wg-x="440" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="450px" y="110px" fill="#7B7982" data-wg-x="450" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="90px" data-wg-x="390" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="390px" y="100px" data-wg-x="390" data-wg-y="100" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="390px" y="110px" data-wg-x="390" data-wg-y="110" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="390px" y="120px" data-wg-x="390" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="390px" y="130px" data-wg-x="390" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="90px" data-wg-x="400" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="100px" data-wg-x="400" data-wg-y="100" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="110px" data-wg-x="400" data-wg-y="110" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="120px" data-wg-x="400" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="400px" y="130px" data-wg-x="400" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="410px" y="90px" data-wg-x="410" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="410px" y="100px" data-wg-x="410" data-wg-y="100" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="410px" y="110px" data-wg-x="410" data-wg-y="110" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="410px" y="120px" data-wg-x="410" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="410px" y="130px" data-wg-x="410" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="420px" y="120px" data-wg-x="420" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="420px" y="130px" data-wg-x="420" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="430px" y="120px" data-wg-x="430" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="430px" y="130px" data-wg-x="430" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="440px" y="120px" data-wg-x="440" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="440px" y="130px" data-wg-x="440" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="450px" y="120px" data-wg-x="450" data-wg-y="120" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="450px" y="130px" data-wg-x="450" data-wg-y="130" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="430px" y="90px" data-wg-x="430" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="430px" y="100px" data-wg-x="430" data-wg-y="100" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="440px" y="90px" data-wg-x="440" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="440px" y="100px" data-wg-x="440" data-wg-y="100" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="450px" y="90px" data-wg-x="450" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="450px" y="100px" data-wg-x="450" data-wg-y="100" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="420px" y="90px" fill="#7B7982" data-wg-x="420" data-wg-y="90" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="100px" fill="#7B7982" data-wg-x="420" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="110px" fill="#7B7982" data-wg-x="420" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="140px" fill="#7B7982" data-wg-x="420" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="430px" y="140px" fill="#7B7982" data-wg-x="430" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="440px" y="140px" fill="#7B7982" data-wg-x="440" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="450px" y="140px" fill="#7B7982" data-wg-x="450" data-wg-y="140" data-wg-type="wall"></rect>
</svg>    
`;

    const services = setup(worldMap, FileFormat.SVG);

    const worldItems = services.importerService.import(worldMap, []);
    const rooms = worldItems.filter(worldItem => worldItem.name === 'room');

    expect(rooms).toContainWorldItem({
        isBorder: false,
        dimensions: new Polygon([
            new Point(1, 1),
            new Point(1, 6),
            new Point(8, 6),
            new Point(8, 4),
            new Point(4, 4),
            new Point(4, 1)
        ])
     });

     expect(rooms).toContainWorldItem({
        isBorder: false,
        dimensions: new Polygon([
            new Point(5, 1),
            new Point(5, 3),
            new Point(8, 3),
            new Point(8, 1)
        ])
     });
});
