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
        type: 'window',
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
            path: 'assets/models/',
            fileName: 'bed.babylon',
            scale: 2.7

        },
        materials: ['assets/models/bed_material.png'],
    },
    {
        type: 'table',
        name: 'mesh-descriptor' as 'mesh-descriptor',
        details: {
            name: 'file-descriptor' as 'file-descriptor',
            path: 'assets/models/',
            fileName: 'table.babylon',
            scale: 0.6

        },
        materials: ['assets/models/table_material.png'],
    }
];
