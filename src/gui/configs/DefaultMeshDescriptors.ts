export const defaultMeshDescriptors = [
    {
        type: 'wall',
        char: 'W',
        shape: 'rect',
        isBorder: true
    },
    {
        type: 'door',
        char: 'D',
        model: 'models/door/door.babylon',
        scale: 3,
        translateY: -4,
        materials: ['models/door/door_material.png'],
        isBorder: true
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
        isBorder: true
    },
    {
        type: 'chair',
        char: 'H',
        model: 'models/chair.babylon',
        scale: 3,
        materials: ['models/material/bathroom.png'],
        isBorder: false
    },
    {
        type: 'shelves',
        char: 'O',
        model: 'assets/models/shelves/shelves.babylon',
        scale: 3.3,
        translateY: 1,
        materials: ['assets/models/shelves/shelves.png'],
        isBorder: false
    },
    {
        type: 'stairs',
        char: 'R',
        model: 'assets/models/stairs/stairs.babylon',
        scale: 3,
        translateY: 2,
        materials: ['assets/models/stairs/stairs_uv.png'],
        isBorder: false
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
