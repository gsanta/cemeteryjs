
import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, Color3 } from 'babylonjs';
import { BabylonImporter } from '../api/BabylonImporter';
import { TreeIteratorGenerator } from '../../../utils/TreeIteratorGenerator';
(<any> window).earcut = require('earcut');
// const strWorld = require('../../../../assets/test/babylonjs_demo.gwm').default;

// const strWorld = require('raw-loader!../../../../assets/test/demo_world.gwm');
// import strWorld from 'raw-loader!../../../../assets/test/demo_world.gwm';

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
    public setupDemo(canvas: HTMLCanvasElement): Promise<void> {

        const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("Camera", 0, 0, 40, new Vector3(0, 0, 0), scene);
        camera.setPosition(new Vector3(0, 40, 20));
        camera.attachControl(canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1;

        return <any> new BabylonImporter(scene as any)
            .import(
                strWorld,
                [
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
                        translateY: -0.5,
                        details: {
                            name: 'file-descriptor' as 'file-descriptor',
                            path: 'models/',
                            fileName: 'window.babylon',
                            materials: [],
                            scale: 1
                        }
                    },
                    {
                        type: 'chair',
                        name: 'mesh-descriptor' as 'mesh-descriptor',
                        details: {
                            name: 'file-descriptor' as 'file-descriptor',
                            path: 'models/',
                            fileName: 'chair.babylon',
                            materials: ['models/material/bathroom.png'],
                            scale: 3
                        }
                    },
                    {
                        type: 'wall',
                        name: 'mesh-descriptor' as 'mesh-descriptor',
                        details: {
                            name: 'shape-descriptor' as 'shape-descriptor',
                            shape: 'rect',
                            conditionalMaterial: {
                                name: 'parent-based-material'
                            }
                        }
                    },
                ]
            )
            .then(worldItems => {
                worldItems.forEach(rootItem => {
                    for (const item of TreeIteratorGenerator(rootItem)) {
                        if (item.name === 'room') {
                            item.meshTemplate.meshes[1].isVisible = false;
                        }
                    }
                });


                engine.runRenderLoop(() => scene.render());
            });
    }
}
