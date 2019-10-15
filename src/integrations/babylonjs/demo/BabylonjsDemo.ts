import { ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3 } from 'babylonjs';
import { WorldItem } from '../../../WorldItem';
import { BabylonWorldGenerator } from '../BabylonWorldGenerator';
(<any> window).earcut = require('earcut');

/*

*/
/*
WWWWWWWWWIIWWWWWWWWWWWWWWWWW
W---------------OOOOO------W
W---------------OOOOO------W
W--------------------------W
W--------------------------W
W--------------------------W
W--------OOOOO-------------W
W--------OOOOO-------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWW

WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W-------------------------------W-------------------W
W-------------------------------W-------------------W
W-------------------------------W-------------------W
W-------------------------------W-------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W---------------------------------------------------W
W---------------------------------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WEEEEE-----OOOOO-------------TTTTTW-----------------W
WEEEEE-----OOOOO-------------TTTTTW-----------------W
W--------XX----TTT---------------OD-----------------I
W--------XX----TTT------OOOOO----OD-----------------I
WOOO--------------------OOOOO----OW-----------------W
WWWWIIIIWWWWWWWWWWWWWDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
*/

/*
WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W-----------------==H=H==-------W-------------------W
W-----------------=TTTTT=-------W-------------------W
W-----------------=TTTTT=-------W-------------------W
W-----------------==H=H==-------W-------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W---------------------------------------------------W
W---------------------------------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WEEEEE-----OOOOO-------------TTTTTW-----------------W
WEEEEE-----OOOOO-------------TTTTTW-----------------W
W--------XX----TTT---------------OD-----------------I
W--------XX----TTT------OOOOO----OD-----------------I
WOOO--------------------OOOOO----OW-----------------W
WWWWIIIIWWWWWWWWWWWWWDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
*/
const strWorld = `map \`

WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W-------------------------------W-------------------W
W-------------------------------W-------------------W
W-------------------------------W-------------------W
W-------------------------------W-------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W---------------------------------------------------W
W---------------------------------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WEEEEE-----OOOOO-------------TTTTTW-----------------W
WEEEEE-----OOOOO-------------TTTTTW-----------------W
W--------XX----TTT---------------OD-----------------I
W--------XX----TTT------OOOOO----OD-----------------I
WOOO--------------------OOOOO----OW-----------------W
WWWWIIIIWWWWWWWWWWWWWDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

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
D = door
L = double_bed
O = shelves
= = subarea

\`

`

export class BabylonjsDemo {
    public setupDemo(model: string, canvas: HTMLCanvasElement): void {

        const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("Camera", 0, 0, 40, new Vector3(0, 0, 0), scene);
        camera.setPosition(new Vector3(0, 40, 20));
        camera.attachControl(canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1;

        new BabylonWorldGenerator(scene).generate(model, {
            convert(worldItem: WorldItem): any {
                if (worldItem.name === 'wall' && worldItem.children.length > 0) {
                    worldItem.meshTemplate.meshes[0].isVisible = false;
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