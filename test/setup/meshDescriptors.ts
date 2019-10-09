import { MeshDescriptor } from "../../src/Config";

export const meshDescriptors: MeshDescriptor[] = [
    {
        type: 'room',
    },
    {
        type: 'disc',
        shape: 'disc',
        translateY: 2
    },
    {
        type: 'door',
        model: 'models/door/door.babylon',
        scale: 3,
        translateY: -4,
        materials: ['models/door/door_material.png'],
        realDimensions: {
            width: 3
        }
    },
    {
        type: 'window',
        model: 'models/window/window.babylon',
        scale: 3,
        translateY: 0,
        materials: ['assets/models/window/window.png'],
        realDimensions: {
            width: 3.5
        }
        // W = window dim S 3 W 3.5 H 3.5 mod P models/window/ N window.babylon mat F assets/models/window/window.png
        // W = window dim S 3 W 3.5 H 3.5 mod S rect mat F assets/models/window/window.png
        // W = window DIM s 3 w 3.5 h 3.5 MOD s rect MAT f assets/models/window/window.png
    },
    {
        type: 'chair',
        materials: ['models/material/bathroom.png'],
        model: 'models/chair.babylon',
    },
    {
        type: 'empty',
        materials: [],
        shape: 'plane',
    },
    {
        type: 'wall',
        materials: [
            '#FFFFFF'
        ],
        shape: 'rect',
    },
    {
        type: 'bed',
        model: 'assets/models/bed/bed.babylon',
        scale: 3.5,
        translateY: 1.5,
        materials: ['assets/models/bed/bed_material.png'],
    },
    {
        type: 'shelves',
        model: 'assets/models/shelves/shelves.babylon',
        scale: 3.3,
        translateY: 1,
        materials: ['assets/models/shelves/shelves.png'],
    },
    {
        type: 'double_bed',
        model: 'assets/models/double_bed/double_bed.babylon',
        scale: 3.5,
        translateY: 1.5,
        materials: ['assets/models/bed/bed_material.png'],
    },
    {
        type: 'table',
        model: 'assets/models/table.babylon',
        scale: 0.5,
        materials: ['assets/models/table_material.png'],
    },
    {
        type: 'stairs',
        model: 'assets/models/stairs/stairs.babylon',
        scale: 3,
        translateY: 2,
        materials: ['assets/models/stairs/stairs_uv.png'],
    },
    {
        type: 'player',
        model: 'models/player/player.babylon',
        scale: 0.26,
        translateY: -1,
        materials: [
            'models/player/material/0.jpg',
            'models/player/material/1.jpg',
            'models/player/material/2.jpg',
            'models/player/material/3.jpg'
        ],
    },
];
