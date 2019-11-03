export const defaultWorldItemTypes = [
    {
        typeName: 'wall',
        char: 'W',
        shape: 'rect',
        isBorder: true,
        color: '#7B7982'
    },
    {
        typeName: 'door',
        char: 'D',
        model: 'models/door/door.babylon',
        scale: 3,
        translateY: -4,
        materials: ['models/door/door_material.png'],
        isBorder: true,
        color: '#BFA85C'
    },
    {
        typeName: 'table',
        char: 'T',
        model: 'assets/models/table.babylon',
        scale: 0.5,
        materials: ['assets/models/table_material.png'],
        isBorder: false
    },
    {
        typeName: 'window',
        char: 'I',
        model: 'models/window/window.babylon',
        scale: 3,
        materials: ['assets/models/window/window.png'],
        isBorder: true,
        color: '#70C0CF'
    },
    {
        typeName: 'chair',
        char: 'H',
        model: 'models/chair.babylon',
        scale: 3,
        materials: ['models/material/bathroom.png'],
        isBorder: false,
        color: '#9894eb'
    },
    {
        typeName: 'shelves',
        char: 'O',
        model: 'assets/models/shelves/shelves.babylon',
        scale: 3.3,
        translateY: 1,
        materials: ['assets/models/shelves/shelves.png'],
        isBorder: false,
        color: '#8c7f6f'
    },
    {
        typeName: 'stairs',
        char: 'R',
        model: 'assets/models/stairs/stairs.babylon',
        scale: 3,
        translateY: 2,
        materials: ['assets/models/stairs/stairs_uv.png'],
        isBorder: false,
        color: '#66553f'
    },
    {
        typeName: 'outdoors',
        char: '*',
        isBorder: false
    },
    {
        typeName: 'room',
        char: '-',
        isBorder: false
    },
    {
        typeName: 'player',
        char: 'X',
        isBorder: false
    }
];
