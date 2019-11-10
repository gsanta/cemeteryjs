import { SvgConfigReader } from '../../../../src/model/readers/svg/SvgConfigReader';

it ('Read the config metadata from the svg file', () => {
    var worldMap =
    `<svg data-wg-width="100" data-wg-height="50" data-wg-pixel-size="10">
        <metadata>
            <wg-type type-name="door" color="red" model="models/door/door.babylon" scale="3" translate-y="-4" materials="models/door/door_material1.png, models/door/door_material2.png" is-border="true"/>
            <wg-type type-name="wall" color="brown" is-border="true"/>
            <wg-type type-name="table" color="yellow" model="models/table/table.babylon" scale="1" translate-y="2" materials="models/table/table.png" is-border="false"/>
        </metadata>
        <rect width="10px" height="10px" x="410px" y="120px" fill="red" data-wg-x="10" data-wg-y="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" data-wg-x="20" data-wg-y="10" data-wg-type="door"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" data-wg-x="30" data-wg-y="10" data-wg-type="wall"></rect>
    </svg>`;

    const svgConfigReader = new SvgConfigReader();

    const {worldItemTypes} = svgConfigReader.read(worldMap);

    expect(worldItemTypes.length).toEqual(3);

    expect(worldItemTypes[0]).toMatchMeshDescriptor({
        typeName: 'door',
        color: 'red',
        scale: 3,
        translateY: -4,
        materials: ['models/door/door_material1.png', 'models/door/door_material2.png'],
        isBorder: true
    });

    expect(worldItemTypes[1]).toMatchMeshDescriptor({
        typeName: 'wall',
        color: 'brown',
        scale: 1,
        translateY: 0,
        materials: [],
        isBorder: true
    });
});