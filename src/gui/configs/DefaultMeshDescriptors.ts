export const defaultMeshDescriptors = [
    {
        type: 'wall',
        char: 'W',
        shape: 'rect',
        isBorder: true,
        color: '#7B7982'
    },
    {
        type: 'door',
        char: 'D',
        model: 'models/door/door.babylon',
        scale: 3,
        translateY: -4,
        materials: ['models/door/door_material.png'],
        isBorder: true,
        color: '#BFA85C'
    },
    {
        type: 'table',
        char: 'T',
        model: 'assets/models/table.babylon',
        scale: 0.5,
        materials: ['assets/models/table_material.png'],
        isBorder: false
    },
    {
        type: 'window',
        char: 'I',
        model: 'models/window/window.babylon',
        scale: 3,
        materials: ['assets/models/window/window.png'],
        isBorder: true,
        color: '#70C0CF'
    },
    {
        type: 'chair',
        char: 'H',
        model: 'models/chair.babylon',
        scale: 3,
        materials: ['models/material/bathroom.png'],
        isBorder: false,
        color: '#9894eb'
    },
    {
        type: 'shelves',
        char: 'O',
        model: 'assets/models/shelves/shelves.babylon',
        scale: 3.3,
        translateY: 1,
        materials: ['assets/models/shelves/shelves.png'],
        isBorder: false,
        color: '#8c7f6f'
    },
    {
        type: 'stairs',
        char: 'R',
        model: 'assets/models/stairs/stairs.babylon',
        scale: 3,
        translateY: 2,
        materials: ['assets/models/stairs/stairs_uv.png'],
        isBorder: false,
        color: '#66553f'
    },
    {
        type: 'outdoors',
        char: '*',
        isBorder: false
    },
    {
        type: 'room',
        char: '-',
        isBorder: false
    },
    {
        type: 'player',
        char: 'X',
        isBorder: false
    }

];
