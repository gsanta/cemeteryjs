import { MeshDescriptor } from "../../src/Config";

export const meshDescriptors: MeshDescriptor[] = [
    {
        type: 'room',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'room-descriptor' as 'room-descriptor',
            roofMaterialPath: './assets/textures/roof.jpeg',
            roofY: 7.21
        }
    },
    {
        type: 'disc',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'shape-descriptor' as 'shape-descriptor',
            shape: 'disc',
            translateY: 2
        }
    },
    {
        type: 'door',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'models/door/',
            fileName: 'door.babylon',
            scale: 3
        },
        translateY: -4,
        materials: ['models/door/door_material.png'],
        realDimensions: {
            name: 'border-dimensions-descriptor' as 'border-dimensions-descriptor',
            width: 3
        }
    },
    {
        type: 'window',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'models/window/',
            fileName: 'window.babylon',
            scale: 3
        },
        translateY: 0,
        materials: ['#FFFFFF'],
    },
    {
        type: 'chair',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        materials: ['models/material/bathroom.png'],
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'models/',
            fileName: 'chair.babylon',
            scale: 3
        },
    },
    {
        type: 'empty',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        materials: [],
        details: {
            name: 'shape-descriptor' as 'shape-descriptor',
            shape: 'plane',
        },
    },
    {
        type: 'wall',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        conditionalMaterials: [
            {
                name: 'parent-room-based-material-descriptor',
                parentId: 'root-1',
                path: './assets/textures/brick.jpeg'
            }
        ],
        materials: [
            '#FFFFFF'
        ],
        details: {
            name: 'shape-descriptor' as 'shape-descriptor',
            shape: 'rect'
        }
    },
    {
        type: 'bed',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'assets/models/bed/',
            fileName: 'bed.babylon',
            scale: 3.5

        },
        translateY: 1.5,
        materials: ['assets/models/bed/bed_material.png'],
    },
    {
        type: 'double_bed',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'assets/models/double_bed/',
            fileName: 'double_bed.babylon',
            scale: 3.5

        },
        translateY: 1.5,
        materials: ['assets/models/bed/bed_material.png'],
    },
    {
        type: 'table',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'assets/models/',
            fileName: 'table.babylon',
            scale: 0.5

        },
        materials: ['assets/models/table_material.png'],
    },
    {
        type: 'player',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'models/player/',
            fileName: 'player.babylon',
            scale: 0.26,
            translateY: -1
        },
        materials: [
            'models/player/material/0.jpg',
            'models/player/material/1.jpg',
            'models/player/material/2.jpg',
            'models/player/material/3.jpg'
        ],
    },
];
