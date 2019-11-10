import { setup } from '../testUtils';
import { FileFormat } from '../../../src/WorldGenerator';


it ('Import world items from svg format', () => {
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

    expect(worldItems.length).toEqual(20);
});