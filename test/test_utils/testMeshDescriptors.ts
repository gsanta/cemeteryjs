import { MeshDescriptor } from "../../src/Config";


export const testMeshDescriptors: MeshDescriptor[] = [
    {
        name: 'mesh-descriptor',
        type: 'table',
        details: {
            name: 'shape-descriptor',
            shape: 'rect',
            translateY: 0
        },
        translateY: 0,
        materials: [],
        realDimensions: {
            name: 'furniture-dimensions-descriptor',
            width: 2,
            height: 1
        }
    }, {
        name: 'mesh-descriptor',
        type: 'chair',
        details: {
            name: 'shape-descriptor',
            shape: 'rect',
            translateY: 0
        },
        translateY: 0,
        materials: [],
        realDimensions: {
            name: 'furniture-dimensions-descriptor',
            width: 1,
            height: 1
        }
    },
]
