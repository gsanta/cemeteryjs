import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, Color3 } from 'babylonjs';
import { BabylonWorldGenerator } from '../BabylonWorldGenerator';
(<any> window).earcut = require('earcut');
// const strWorld = require('../../../../assets/test/babylonjs_demo.gwm').default;

// const strWorld = require('raw-loader!../../../../assets/test/demo_world.gwm');
// import strWorld from 'raw-loader!../../../../assets/test/demo_world.gwm';
import { MeshDescriptor } from '../../api/Config';
import { WorldConfig } from '../../../services/ImporterService';
import { WorldItem } from '../../../WorldItemInfo';

const strWorld = `map \`

WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W-------------------------------W-------------------W
W-------------------------------W-------------------W
W-------------------------------W-------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W---------------------------------------------------W
W---------------------------------------------------W
W---------------------------------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W--------------W------------------W-----------------W
W--------------W------------------W-----------------W
W--------------W------------------W-----------------I
W--------------W------------------W-----------------I
W--------------W------------------W-----------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

\`

definitions \`

W = wall
- = empty
X = player
D = disc
C = cupboard
I = window
T = table
B = bathtub
S = washbasin
E = bed
H = chair

\`

`

export class BabylonjsDemo {
    public setupDemo(canvas: HTMLCanvasElement): void {

        const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("Camera", 0, 0, 40, new Vector3(0, 0, 0), scene);
        camera.setPosition(new Vector3(0, 40, 20));
        camera.attachControl(canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1;

        const worldConfig: WorldConfig = {
            meshDescriptors: meshDescriptors,
            borders: ['door', 'window', 'wall'],
            furnitures: ['empty', 'player', 'cupboard', 'table', 'bathtub', 'washbasin', 'bed', 'chair'],
            xScale: 1,
            yScale: 2
        }

        new BabylonWorldGenerator(scene).generate(strWorld, worldConfig, {
            convert(worldItem: WorldItem): any {
                if (worldItem.name === 'room') {
                    // worldItem.meshTemplate.meshes[1].isVisible = false;
                }
            },
            addChildren(parent: any, children: any[]): void {},
            addBorders(item: any, borders: any[]): void {},
            done() {
                engine.runRenderLoop(() => scene.render());
            }
        });
    }
}

const meshDescriptors: MeshDescriptor[] = [
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
    }
];
